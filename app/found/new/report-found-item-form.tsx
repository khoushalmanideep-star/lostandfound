"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type FoundItemFormValues, foundItemSchema } from "@/features/items/schemas/found-item";

export function ReportFoundItemForm() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FoundItemFormValues>({
    resolver: zodResolver(foundItemSchema),
    defaultValues: {
      title: "",
      category: "",
      color: "",
      description: "",
      location: "",
      dateFound: "",
    },
  });

  const onSubmit = async (values: FoundItemFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("color", values.color);
    formData.append("description", values.description);
    formData.append("location", values.location);
    formData.append("dateFound", values.dateFound);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch("/api/items/found", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(payload?.error ?? "Could not submit found item.");
      return;
    }

    toast.success("Found item report submitted.");
    reset();
    setImageFile(null);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1 md:col-span-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          {...register("title")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Silver water bottle"
        />
        {errors.title ? <p className="text-xs text-red-600">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-1 md:col-span-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <input
          id="category"
          {...register("category")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Bottle, Electronics, Accessories"
        />
        {errors.category ? <p className="text-xs text-red-600">{errors.category.message}</p> : null}
      </div>

      <div className="space-y-1 md:col-span-1">
        <label htmlFor="color" className="text-sm font-medium">
          Color
        </label>
        <input
          id="color"
          {...register("color")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Silver"
        />
        {errors.color ? <p className="text-xs text-red-600">{errors.color.message}</p> : null}
      </div>

      <div className="space-y-1 md:col-span-1">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <input
          id="location"
          {...register("location")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Cafeteria counter"
        />
        {errors.location ? <p className="text-xs text-red-600">{errors.location.message}</p> : null}
      </div>

      <div className="space-y-1 md:col-span-1">
        <label htmlFor="dateFound" className="text-sm font-medium">
          Date Found
        </label>
        <input
          id="dateFound"
          type="date"
          {...register("dateFound")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        {errors.dateFound ? <p className="text-xs text-red-600">{errors.dateFound.message}</p> : null}
      </div>

      <div className="space-y-1 md:col-span-1">
        <label htmlFor="image" className="text-sm font-medium">
          Image Upload
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Describe where and how the item was found."
        />
        {errors.description ? <p className="text-xs text-red-600">{errors.description.message}</p> : null}
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isSubmitting ? "Submitting..." : "Submit Found Item"}
        </button>
      </div>
    </form>
  );
}
