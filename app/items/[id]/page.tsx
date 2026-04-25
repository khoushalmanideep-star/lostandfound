import Link from "next/link";
import { MapPin, ShieldCheck, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

type ItemDetailsPageProps = {
  params: Promise<{ id: string }>;
};

type FoundItem = {
  id: string;
  title: string;
  category: string;
  color: string | null;
  description: string;
  location: string | null;
  image_url: string | null;
  date_found: string | null;
  created_at: string;
  status: string;
};

export default async function ItemDetailsPage({ params }: ItemDetailsPageProps) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("items")
    .select("id,title,category,color,description,location,image_url,date_found,created_at,status")
    .eq("id", id)
    .eq("type", "found")
    .single();

  if (error || !data) {
    notFound();
  }

  const item = data as FoundItem;
  const displayDate = item.date_found ?? item.created_at;

  return (
    <PageShell title={item.title} description="Found item details and claim flow entry point.">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800/60">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt={item.title} className="h-full min-h-[320px] w-full object-cover" />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              No image uploaded
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/60">
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{item.category}</Badge>
            {item.color ? <Badge>{item.color}</Badge> : null}
            <Badge variant={item.status === "open" ? "success" : item.status === "claimed" ? "warning" : "default"}>
              {item.status}
            </Badge>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">{item.title}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
          </div>

          <div className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900/60">
            <p className="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
              <Tag className="h-4 w-4" />
              <span>Category: {item.category}</span>
            </p>
            <p className="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
              <MapPin className="h-4 w-4" />
              <span>Location: {item.location ?? "Not specified"}</span>
            </p>
            <p className="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
              <ShieldCheck className="h-4 w-4" />
              <span>Date: {new Date(displayDate).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/claims?itemId=${item.id}`}
              className="saas-btn-primary px-5 py-2.5"
            >
              Claim This Item
            </Link>
            <Link
              href="/items"
              className="saas-btn-secondary px-5 py-2.5"
            >
              Back to Browse
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
