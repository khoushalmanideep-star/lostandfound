import { PageShell } from "@/components/layout/page-shell";
import { ClaimModerationButtons, DeleteItemButton } from "@/app/admin/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export default async function AdminPage() {
  await requireAdmin();

  const supabase = createServiceRoleSupabaseClient();
  const [{ data: users }, { data: items }, { data: claims }] = await Promise.all([
    supabase.from("users").select("id,clerk_id,name,email,role,created_at").order("created_at", { ascending: false }),
    supabase
      .from("items")
      .select("id,type,title,category,color,location,status,created_at,user_id")
      .order("created_at", { ascending: false }),
    supabase
      .from("claims")
      .select("id,item_id,claimer_id,status,created_at,message,proof")
      .order("created_at", { ascending: false }),
  ]);

  // The project uses a minimal Supabase `Database` type and selects by string.
  // In some setups this can cause `data` to infer as `never[]`. Normalize here.
  const safeItems = (items ?? []) as Array<{ status?: string }>;
  const safeClaims = (claims ?? []) as Array<{ status?: string }>;
  const safeClaimsRows = (claims ?? []) as Array<{
    id: string;
    item_id: string;
    claimer_id: string;
    status: string;
    created_at: string;
  }>;
  const safeItemsRows = (items ?? []) as Array<{
    id: string;
    type: string;
    title: string;
    category: string;
    location: string | null;
    status: string;
    created_at: string;
  }>;
  const safeUsersRows = (users ?? []) as Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
  }>;

  const stats = {
    users: users?.length ?? 0,
    items: items?.length ?? 0,
    openItems: safeItems.filter((i) => i.status === "open").length,
    pendingClaims: safeClaims.filter((c) => c.status === "pending").length,
  };

  return (
    <PageShell
      title="Admin Panel"
      description="Moderate claims, manage posts, and view platform activity."
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Users", value: stats.users },
            { label: "Total Items", value: stats.items },
            { label: "Open Items", value: stats.openItems },
            { label: "Pending Claims", value: stats.pendingClaims },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/60"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold">{card.value}</p>
            </article>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">All Claims</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Claim ID</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Claimer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {safeClaimsRows.map((c) => (
                  <tr key={c.id} className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60">
                    <td className="px-4 py-3 font-mono text-xs">{String(c.id).slice(0, 8)}…</td>
                    <td className="px-4 py-3 font-mono text-xs">{String(c.item_id).slice(0, 8)}…</td>
                    <td className="px-4 py-3 font-mono text-xs">{String(c.claimer_id).slice(0, 8)}…</td>
                    <td className="px-4 py-3 capitalize">{c.status}</td>
                    <td className="px-4 py-3">{new Date(String(c.created_at)).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {c.status === "pending" ? <ClaimModerationButtons claimId={String(c.id)} /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">All Items</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {safeItemsRows.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60">
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3 capitalize">{item.type}</td>
                    <td className="px-4 py-3 capitalize">{item.status}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.location ?? "N/A"}</td>
                    <td className="px-4 py-3">{new Date(String(item.created_at)).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <DeleteItemButton itemId={String(item.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">All Users</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {safeUsersRows.map((u) => (
                  <tr key={u.id} className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">{new Date(String(u.created_at)).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
