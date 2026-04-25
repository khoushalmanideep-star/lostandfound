import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { claimId, itemId } = (await req.json()) as { claimId?: string; itemId?: string };
    const parsedClaimId = (claimId ?? "").trim();
    const parsedItemId = (itemId ?? "").trim();

    if (!parsedClaimId || !parsedItemId) {
      return NextResponse.json({ error: "Claim and item are required." }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();

    const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", userId).single();
    if (!dbUser?.id) {
      return NextResponse.json({ error: "User profile not found." }, { status: 400 });
    }

    const { data: claim, error: claimError } = await supabase
      .from("claims")
      .select("id,item_id,claimer_id,status")
      .eq("id", parsedClaimId)
      .eq("item_id", parsedItemId)
      .eq("claimer_id", dbUser.id)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }

    if (claim.status !== "approved") {
      return NextResponse.json({ error: "Only approved claims can be marked returned." }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("items")
      .update({ status: "returned" })
      .eq("id", parsedItemId)
      .neq("status", "returned");

    if (updateError) {
      return NextResponse.json({ error: "Failed to mark item as returned." }, { status: 500 });
    }

    const { data: itemRow } = await supabase.from("items").select("id,title,user_id").eq("id", parsedItemId).single();
    if (itemRow?.user_id) {
      await createNotification({
        userId: itemRow.user_id as string,
        type: "item_returned",
        title: "Item marked as returned",
        body: `A claimed item (${String(itemRow.title ?? "item")}) was confirmed as received and marked returned.`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
