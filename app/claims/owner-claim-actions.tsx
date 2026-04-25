"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type OwnerClaimActionsProps = {
  claimId: string;
};

export function OwnerClaimActions({ claimId }: OwnerClaimActionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<"approve" | "reject" | null>(null);

  const moderate = async (action: "approve" | "reject") => {
    setIsSubmitting(action);
    try {
      const response = await fetch(`/api/claims/${claimId}/moderate`, {
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
      setIsSubmitting(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isSubmitting !== null}
        onClick={() => moderate("approve")}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting === "approve" ? "Approving..." : "Approve"}
      </button>
      <button
        type="button"
        disabled={isSubmitting !== null}
        onClick={() => moderate("reject")}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {isSubmitting === "reject" ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
}

