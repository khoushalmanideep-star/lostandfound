import { PageShell } from "@/components/layout/page-shell";
import { ClaimRequestForm } from "@/app/claims/claim-request-form";
import { ConfirmReceivedButton } from "@/app/claims/confirm-received-button";
import { OwnerClaimActions } from "@/app/claims/owner-claim-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

type ClaimsPageProps = {
  searchParams?: Promise<{ itemId?: string }>;
};

export default async function ClaimsPage({ searchParams }: ClaimsPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const params = (await searchParams) ?? {};
  const itemId = params.itemId?.trim() ?? "";
  const supabase = createServiceRoleSupabaseClient();

  let itemTitle: string | undefined;
  let claims: Array<{
    id: string;
    item_id: string;
    message: string | null;
    proof: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    item_title: string;
    item_category: string;
    item_location: string | null;
    item_status: "open" | "claimed" | "returned";
  }> = [];

  let incomingClaims: Array<{
    id: string;
    item_id: string;
    message: string | null;
    proof: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    item_title: string;
    claimer_name: string;
  }> = [];

  if (itemId) {
    const { data } = await supabase.from("items").select("title").eq("id", itemId).single();
    itemTitle = data?.title as string | undefined;
  }

  const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", userId).single();

  if (dbUser?.id) {
    const { data: userClaims } = await supabase
      .from("claims")
      .select("id,item_id,message,proof,status,created_at")
      .eq("claimer_id", dbUser.id)
      .order("created_at", { ascending: false });

    const claimRows =
      (userClaims as Array<{
        id: string;
        item_id: string;
        message: string | null;
        proof: string | null;
        status: "pending" | "approved" | "rejected";
        created_at: string;
      }> | null) ?? [];

    const itemIds = [...new Set(claimRows.map((claim) => claim.item_id))];
    const itemsById = new Map<
      string,
      { title: string; category: string; location: string | null; status: "open" | "claimed" | "returned" }
    >();

    if (itemIds.length > 0) {
      const { data: linkedItems } = await supabase
        .from("items")
        .select("id,title,category,location,status")
        .in("id", itemIds);
      for (const item of linkedItems ?? []) {
        itemsById.set(item.id as string, {
          title: (item.title as string) ?? "Item",
          category: (item.category as string) ?? "General",
          location: (item.location as string | null) ?? null,
          status: ((item.status as "open" | "claimed" | "returned" | null) ?? "open"),
        });
      }
    }

    claims = claimRows.map((claim) => {
      const item = itemsById.get(claim.item_id);
      return {
        ...claim,
        item_title: item?.title ?? "Deleted Item",
        item_category: item?.category ?? "Unknown",
        item_location: item?.location ?? null,
        item_status: item?.status ?? "open",
      };
    });

    const { data: myItems } = await supabase.from("items").select("id,title").eq("user_id", dbUser.id);
    const myItemIds = (myItems ?? []).map((i) => String(i.id));
    const myItemsById = new Map<string, string>();
    for (const item of myItems ?? []) {
      myItemsById.set(String(item.id), String(item.title ?? "Item"));
    }

    if (myItemIds.length > 0) {
      const { data: rawIncomingClaims } = await supabase
        .from("claims")
        .select("id,item_id,claimer_id,message,proof,status,created_at")
        .in("item_id", myItemIds)
        .order("created_at", { ascending: false })
        .limit(50);

      const incomingRows =
        (rawIncomingClaims as Array<{
          id: string;
          item_id: string;
          claimer_id: string;
          message: string | null;
          proof: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        }> | null) ?? [];

      const claimerIds = [...new Set(incomingRows.map((c) => c.claimer_id))];
      const claimersById = new Map<string, string>();

      if (claimerIds.length > 0) {
        const { data: claimers } = await supabase.from("users").select("id,name").in("id", claimerIds);
        for (const u of claimers ?? []) {
          claimersById.set(String(u.id), String(u.name ?? "User"));
        }
      }

      incomingClaims = incomingRows.map((c) => ({
        id: c.id,
        item_id: c.item_id,
        message: c.message,
        proof: c.proof,
        status: c.status,
        created_at: c.created_at,
        item_title: myItemsById.get(c.item_id) ?? "Item",
        claimer_name: claimersById.get(c.claimer_id) ?? "User",
      }));
    }
  }

  return (
    <PageShell
      title="My Claims"
      description="Submit and track your claim requests with live status updates."
    >
      <div className="saas-gradient-border mb-6 p-4 text-sm text-zinc-700 dark:text-zinc-200">
        <p className="font-medium">How to use this page</p>
        <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
          <li>
            - <span className="font-semibold">Incoming Claims</span>: if you posted a found item, review and approve/reject
            claims here.
          </li>
          <li>
            - <span className="font-semibold">Submitted Claims</span>: if you lost an item, track your claim status here.
          </li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/items"
            className="saas-btn-secondary"
          >
            Browse Items
          </Link>
          <Link
            href="/help"
            className="saas-btn-secondary"
          >
            Help
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Incoming Claims (on your posts)</h2>

        {incomingClaims.length === 0 ? (
          <p className="saas-stat text-sm text-zinc-600 dark:text-zinc-300">
            No one has submitted a claim on your items yet.
          </p>
        ) : (
          <div className="space-y-3">
            {incomingClaims.map((c) => (
              <article
                key={c.id}
                className="saas-stat p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Claim</p>
                    <h3 className="mt-1 text-base font-semibold">{c.item_title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      From <span className="font-medium">{c.claimer_name}</span>
                    </p>
                    {c.message ? <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{c.message}</p> : null}
                    {c.proof ? (
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Proof: {c.proof}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={c.status === "approved" ? "success" : c.status === "rejected" ? "danger" : "warning"}
                    >
                      {c.status}
                    </Badge>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {c.status === "pending" ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Approving marks the item as <span className="font-medium">claimed</span>.
                    </p>
                    <OwnerClaimActions claimId={c.id} />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      {itemId ? (
        <div className="saas-stat mb-6 p-5">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">New Claim Request</h2>
          <ClaimRequestForm itemId={itemId} itemTitle={itemTitle} />
        </div>
      ) : (
        <p className="saas-stat mb-6 text-sm text-zinc-600 dark:text-zinc-300">
          Select an item from browse or details page to create a new claim request.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Submitted Claims</h2>

        {claims.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
            You have not submitted any claims yet.
          </p>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Item State</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60">
                      <td className="px-4 py-3 font-medium">{claim.item_title}</td>
                      <td className="px-4 py-3">{claim.item_category}</td>
                      <td className="px-4 py-3">{claim.item_location ?? "N/A"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            claim.status === "approved"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : claim.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">{claim.item_status}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {claim.status === "approved" && claim.item_status !== "returned" ? (
                          <ConfirmReceivedButton claimId={claim.id} itemId={claim.item_id} />
                        ) : claim.item_status === "returned" ? (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">Already returned</span>
                        ) : (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">Awaiting approval</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {claims.map((claim) => (
                <article
                  key={claim.id}
                  className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium">{claim.item_title}</h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        claim.status === "approved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : claim.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">Category: {claim.item_category}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">Location: {claim.item_location ?? "N/A"}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">Item State: {claim.item_status}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Submitted on {new Date(claim.created_at).toLocaleDateString()}
                  </p>
                  {claim.status === "approved" && claim.item_status !== "returned" ? (
                    <div className="pt-1">
                      <ConfirmReceivedButton claimId={claim.id} itemId={claim.item_id} />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
