"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ItemsFiltersProps = {
  initialKeyword: string;
  initialCategory: string;
  initialColor: string;
  initialLocation: string;
};

function setOrDeleteParam(params: URLSearchParams, key: string, value: string) {
  const next = value.trim();
  if (next) params.set(key, next);
  else params.delete(key);
}

export function ItemsFilters({
  initialKeyword,
  initialCategory,
  initialColor,
  initialLocation,
}: ItemsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [color, setColor] = useState(initialColor);
  const [location, setLocation] = useState(initialLocation);

  const hasAnyFilters = useMemo(() => {
    return Boolean(keyword.trim() || category.trim() || color.trim() || location.trim());
  }, [keyword, category, color, location]);

  const applyParams = (next: { keyword?: string; category?: string; color?: string; location?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(params, "keyword", next.keyword ?? keyword);
    setOrDeleteParam(params, "category", next.category ?? category);
    setOrDeleteParam(params, "color", next.color ?? color);
    setOrDeleteParam(params, "location", next.location ?? location);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  // Debounced keyword search
  useEffect(() => {
    const handle = window.setTimeout(() => {
      applyParams({ keyword });
    }, 400);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const onClear = () => {
    setKeyword("");
    setCategory("");
    setColor("");
    setLocation("");
    router.replace(pathname);
  };

  return (
    <div className="mb-6 grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/60 md:grid-cols-2 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <label className="sr-only" htmlFor="keyword">
          Keyword search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search title or description"
            className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Search updates automatically.</p>
      </div>

      <div className="lg:col-span-3">
        <label className="sr-only" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          value={category}
          onChange={(e) => {
            const v = e.target.value;
            setCategory(v);
            applyParams({ category: v });
          }}
          placeholder="Category"
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="lg:col-span-2">
        <label className="sr-only" htmlFor="color">
          Color
        </label>
        <input
          id="color"
          value={color}
          onChange={(e) => {
            const v = e.target.value;
            setColor(v);
            applyParams({ color: v });
          }}
          placeholder="Color"
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="lg:col-span-3">
        <label className="sr-only" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          value={location}
          onChange={(e) => {
            const v = e.target.value;
            setLocation(v);
            applyParams({ location: v });
          }}
          placeholder="Location"
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="lg:col-span-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Showing active found items only.
          </p>
          {hasAnyFilters ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

