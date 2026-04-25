"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ConfirmReceivedButtonProps = {
  claimId: string;
  itemId: string;
};

export function ConfirmReceivedButton({ claimId, itemId }: ConfirmReceivedButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmReceived = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/claims/confirm-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, itemId }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(payload?.error ?? "Unable to mark item as returned.");
        return;
      }

      toast.success("Item marked as returned.");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={onConfirmReceived}
      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? "Updating..." : "Confirm Received"}
    </button>
  );
}
