"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ClaimModerationButtons({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null);

  const moderate = async (action: "approve" | "reject") => {
    setIsLoading(action);
    try {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(payload?.error ?? "Unable to update claim.");
        return;
      }

      toast.success(action === "approve" ? "Claim approved." : "Claim rejected.");
      router.refresh();
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => moderate("approve")}
        disabled={isLoading !== null}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading === "approve" ? "Approving..." : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => moderate("reject")}
        disabled={isLoading !== null}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading === "reject" ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
}

export function DeleteItemButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    const confirmed = window.confirm("Delete this item post? This cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/items/${itemId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(payload?.error ?? "Unable to delete item.");
        return;
      }

      toast.success("Item deleted.");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={isDeleting}
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
