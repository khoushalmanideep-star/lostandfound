"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ClaimRequestFormProps = {
  itemId: string;
  itemTitle?: string;
};

export function ClaimRequestForm({ itemId, itemTitle }: ClaimRequestFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim() || !proof.trim()) {
      toast.error("Please provide both a message and proof of ownership.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          message,
          proof,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        toast.error(payload?.error ?? "Unable to submit claim.");
        return;
      }

      toast.success("Claim request submitted successfully.");
      setMessage("");
      setProof("");
      router.push("/claims");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/60">
        <p>
          Claiming item: <span className="font-medium">{itemTitle ?? itemId}</span>
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Why do you believe this item belongs to you?"
          className="saas-input min-h-[110px]"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Include where you lost it and one unique identifier (sticker, scratch, contents).
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="proof" className="text-sm font-medium">
          Proof of Ownership
        </label>
        <textarea
          id="proof"
          rows={4}
          value={proof}
          onChange={(event) => setProof(event.target.value)}
          placeholder="Share details only the real owner would know (marks, contents, serial cues)."
          className="saas-input min-h-[110px]"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Don’t share passwords or highly sensitive data. Use non-sensitive identifiers.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="saas-btn-primary w-full px-5 py-2.5"
      >
        {isSubmitting ? "Submitting..." : "Submit Claim Request"}
      </button>
    </form>
  );
}
