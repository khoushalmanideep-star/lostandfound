export default function ItemDetailsLoading() {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
      <div className="mb-6 space-y-2">
        <div className="h-6 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-h-[320px] animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/60">
          <div className="flex gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-900" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-900" />
          </div>
          <div className="h-7 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-900" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-900" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-900" />
          <div className="h-28 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-900" />
          <div className="flex gap-3">
            <div className="h-10 w-40 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-900" />
            <div className="h-10 w-36 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

