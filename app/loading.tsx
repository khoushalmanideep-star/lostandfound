export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="saas-gradient-border px-6 py-5 text-center">
        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Loading</p>
        <div className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          <span className="loading-word-cycle" aria-label="Loading Lost and Found Portal">
            <span className="loading-word">Finding</span>
            <span className="loading-word">Matching</span>
            <span className="loading-word">Verifying</span>
            <span className="loading-word">Returning</span>
          </span>
          <span className="ml-2 text-zinc-400 dark:text-zinc-500">…</span>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Preparing your campus lost-and-found dashboard.
        </p>
      </div>
    </div>
  );
}

