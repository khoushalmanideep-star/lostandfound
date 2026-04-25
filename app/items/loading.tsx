export default function ItemsLoading() {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
      <div className="mb-6 space-y-2">
        <div className="h-6 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/60 md:grid-cols-2 lg:grid-cols-12">
        <div className="h-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 lg:col-span-4" />
        <div className="h-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 lg:col-span-3" />
        <div className="h-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 lg:col-span-2" />
        <div className="h-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 lg:col-span-3" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800/60"
          >
            <div className="h-44 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

