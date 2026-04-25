"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function MarkReadButton({ notificationId }: { notificationId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onMarkRead = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, { method: "PATCH" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(payload?.error ?? "Unable to mark as read.");
        return;
      }
      toast.success("Marked as read.");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onMarkRead}
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      {isLoading ? "Updating..." : "Mark read"}
    </button>
  );
}

