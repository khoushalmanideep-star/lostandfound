import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export type NotificationType =
  | "claim_approved"
  | "claim_rejected"
  | "item_returned"
  | "item_match"
  | "claim_received";

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
}) {
  const supabase = createServiceRoleSupabaseClient();

  await supabase.from("notifications").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
  });
}

