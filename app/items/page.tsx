import { PageShell } from "@/components/layout/page-shell";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ItemsFilters } from "@/app/items/items-filters";
import { Badge } from "@/components/ui/badge";

type BrowseItemsPageProps = {
  searchParams?: Promise<{
    category?: string;
    color?: string;
    location?: string;
    keyword?: string;
  }>;
};

type FoundItemRow = {
  id: string;
  title: string;
  category: string;
  color: string | null;
  description: string;
  location: string | null;
  image_url: string | null;
  created_at: string;
};

export default async function BrowseItemsPage({ searchParams }: BrowseItemsPageProps) {
  const params = (await searchParams) ?? {};
  const category = params.category?.trim() ?? "";
  const color = params.color?.trim() ?? "";
  const location = params.location?.trim() ?? "";
  const keyword = params.keyword?.trim() ?? "";

  let items: FoundItemRow[] = [];
  let hasDataError = false;

  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("items")
      .select("id,title,category,color,description,location,image_url,created_at")
      .eq("type", "found")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.ilike("category", `%${category}%`);
    }
    if (color) {
      query = query.ilike("color", `%${color}%`);
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    }

    const { data, error } = await query;
    if (error) {
      hasDataError = true;
    } else {
      items = (data ?? []) as FoundItemRow[];
    }
  } catch {
    hasDataError = true;
  }

  return (
    <PageShell
      title="Browse Found Items"
      description="Search and filter active found-item listings across campus."
    >
      <ItemsFilters
        initialKeyword={keyword}
        initialCategory={category}
        initialColor={color}
        initialLocation={location}
      />

      {hasDataError ? (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Unable to load items right now. Please verify Supabase environment variables and try again.
        </p>
      ) : null}

      {!hasDataError && items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/60">
          <p className="text-sm font-semibold">No results</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {keyword || category || color || location
              ? "Try clearing filters or using a broader keyword."
              : "No active found items have been posted yet."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/found/new"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Report Found Item
            </Link>
            <Link
              href="/lost/new"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Report Lost Item
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/60"
          >
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image_url} alt={item.title} className="h-44 w-full object-cover" />
            ) : (
              <div className="flex h-44 items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                No image uploaded
              </div>
            )}
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="info">{item.category}</Badge>
                {item.color ? <Badge>{item.color}</Badge> : null}
                {item.location ? <Badge>{item.location}</Badge> : null}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{item.description}</p>
              </div>
              <Link
                href={`/items/${item.id}`}
                className="inline-flex text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-500 dark:text-indigo-300 dark:group-hover:text-indigo-200"
              >
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
