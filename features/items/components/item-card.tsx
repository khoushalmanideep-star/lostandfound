import type { Item } from "@/features/items/types";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-base font-semibold">{item.title}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-zinc-500">
        {item.type} · {item.status}
      </p>
    </article>
  );
}
