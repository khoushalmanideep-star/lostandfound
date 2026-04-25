import { PageShell } from "@/components/layout/page-shell";
import { ReportLostItemForm } from "@/app/lost/new/report-lost-item-form";
import Link from "next/link";

export default function ReportLostItemPage() {
  return (
    <PageShell
      title="Report Lost Item"
      description="Submit details about your lost item so finders can match it."
    >
      <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200">
        <p className="font-medium">What happens after you submit?</p>
        <p className="mt-1 text-indigo-900/80 dark:text-indigo-200/80">
          Next, browse active found posts and submit a claim on the best match. You’ll get notified when your claim is
          approved or rejected.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/items"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Browse Items
          </Link>
          <Link
            href="/help"
            className="rounded-xl border border-indigo-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-indigo-100 dark:border-indigo-700 dark:bg-transparent dark:hover:bg-indigo-900/30"
          >
            View Help
          </Link>
        </div>
      </div>
      <ReportLostItemForm />
    </PageShell>
  );
}
