import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function PATCH(req: Request, ctx: { params: Promise<{ claimId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { claimId } = await ctx.params;
    const parsedClaimId = (claimId ?? "").trim();
    const { action } = (await req.json()) as { action?: "approve" | "reject" };

    if (!parsedClaimId || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();
    const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", userId).single();
    if (!dbUser?.id) return NextResponse.json({ error: "User profile not found." }, { status: 400 });

    const { data: claim, error: claimError } = await supabase
      .from("claims")
      .select("id,item_id,status,claimer_id")
      .eq("id", parsedClaimId)
      .single();

    if (claimError || !claim) return NextResponse.json({ error: "Claim not found." }, { status: 404 });

    const { data: item } = await supabase.from("items").select("id,user_id,status,title").eq("id", claim.item_id).single();
    if (!item?.id) return NextResponse.json({ error: "Item not found." }, { status: 404 });

    // Only the item owner can approve/reject claims.
    if (String(item.user_id) !== String(dbUser.id)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Only allow moderation while claim is pending and item is still open.
    if (String(claim.status) !== "pending") {
      return NextResponse.json({ error: "This claim is already processed." }, { status: 400 });
    }

    if (String(item.status) !== "open") {
      return NextResponse.json({ error: "This item is no longer available for moderation." }, { status: 400 });
    }

    const nextStatus = action === "approve" ? "approved" : "rejected";
    const { error: updateClaimError } = await supabase.from("claims").update({ status: nextStatus }).eq("id", parsedClaimId);
    if (updateClaimError) return NextResponse.json({ error: "Failed to update claim." }, { status: 500 });

    if (action === "approve") {
      await supabase.from("items").update({ status: "claimed" }).eq("id", item.id as string).eq("status", "open");
      await createNotification({
        userId: claim.claimer_id as string,
        type: "claim_approved",
        title: "Claim approved",
        body: `Your claim was approved for "${String(item.title ?? "the item")}". Coordinate pickup and confirm receipt after return.`,
      });
    } else {
      await createNotification({
        userId: claim.claimer_id as string,
        type: "claim_rejected",
        title: "Claim rejected",
        body: `Your claim was rejected for "${String(item.title ?? "the item")}". You can submit a new claim with clearer proof.`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

