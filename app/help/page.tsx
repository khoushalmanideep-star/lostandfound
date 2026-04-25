import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default function HelpPage() {
  return (
    <PageShell title="Help & How to Use" description="Quick guides for first-time users.">
      <div className="space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900/60">
          <h2 className="text-lg font-semibold tracking-tight">If you lost an item</h2>
          <ol className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">1.</span> Report it at{" "}
              <Link className="font-medium text-indigo-600 dark:text-indigo-300" href="/lost/new">
                Report Lost
              </Link>
              .
            </li>
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">2.</span> Browse active found posts at{" "}
              <Link className="font-medium text-indigo-600 dark:text-indigo-300" href="/items">
                Browse Items
              </Link>
              .
            </li>
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">3.</span> Open a likely match and click{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">Claim This Item</span>.
            </li>
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">4.</span> Track status in{" "}
              <Link className="font-medium text-indigo-600 dark:text-indigo-300" href="/claims">
                My Claims
              </Link>{" "}
              and check{" "}
              <Link className="font-medium text-indigo-600 dark:text-indigo-300" href="/notifications">
                Notifications
              </Link>
              .
            </li>
          </ol>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900/60">
          <h2 className="text-lg font-semibold tracking-tight">If you found an item</h2>
          <ol className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">1.</span> Post it at{" "}
              <Link className="font-medium text-indigo-600 dark:text-indigo-300" href="/found/new">
                Report Found
              </Link>
              .
            </li>
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">2.</span> When someone submits a claim,
              you’ll see it in{" "}
              <Link className="font-medium text-indigo-600 dark:text-indigo-300" href="/claims">
                My Claims
              </Link>{" "}
              under <span className="font-medium text-zinc-900 dark:text-zinc-100">Incoming Claims</span>.
            </li>
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">3.</span> Approve or reject the claim.
              Approving marks the item as <span className="font-medium text-zinc-900 dark:text-zinc-100">claimed</span>.
            </li>
            <li>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">4.</span> After handover, the claimer
              confirms receipt which marks the item as{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">returned</span>.
            </li>
          </ol>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/60">
          <h2 className="text-lg font-semibold tracking-tight">Tips to avoid delays</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>
              - Use specific details: unique marks, contents, serial cues, exact location and date.
            </li>
            <li>
              - Check the bell icon for notifications (it shows an unread count).
            </li>
            <li>
              - If you’re the finder, review Incoming Claims promptly.
            </li>
          </ul>
        </section>
      </div>
    </PageShell>
  );
}

