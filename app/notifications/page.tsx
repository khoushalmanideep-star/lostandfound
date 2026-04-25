import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { MarkReadButton } from "@/app/notifications/mark-read-button";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type NotificationRow = {
  id: string;
  type: "claim_approved" | "claim_rejected" | "item_returned" | "item_match" | "claim_received";
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export default async function NotificationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceRoleSupabaseClient();
  const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", userId).single();

  const { data } = dbUser?.id
    ? await supabase
        .from("notifications")
        .select("id,type,title,body,read_at,created_at")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
    : { data: [] as NotificationRow[] };

  const notifications = (data ?? []) as NotificationRow[];

  return (
    <PageShell title="Notifications" description="Updates about your claims and returns.">
      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/60">
          <p className="text-sm font-medium">No notifications yet</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Claim updates and potential item matches will appear here.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/items"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Browse Items
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <article
              key={n.id}
              className={`rounded-2xl border p-4 shadow-sm ${
                n.read_at
                  ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/60"
                  : "border-indigo-200 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{n.type}</p>
                  <h3 className="mt-1 text-base font-semibold">{n.title}</h3>
                  {n.body ? <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{n.body}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                  {!n.read_at ? <MarkReadButton notificationId={n.id} /> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}

