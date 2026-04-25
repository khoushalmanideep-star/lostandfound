import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function PATCH(req: Request, ctx: { params: Promise<{ claimId: string }> }) {
  try {
    await requireAdmin();
    const { claimId } = await ctx.params;
    const parsedClaimId = (claimId ?? "").trim();
    const { action } = (await req.json()) as { action?: "approve" | "reject" };

    if (!parsedClaimId || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();
    const { data: claim, error: claimError } = await supabase
      .from("claims")
      .select("id,item_id,status,claimer_id")
      .eq("id", parsedClaimId)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }

    const nextStatus = action === "approve" ? "approved" : "rejected";

    const { error: updateClaimError } = await supabase
      .from("claims")
      .update({ status: nextStatus })
      .eq("id", parsedClaimId);

    if (updateClaimError) {
      return NextResponse.json({ error: "Failed to update claim." }, { status: 500 });
    }

    if (action === "approve") {
      await supabase
        .from("items")
        .update({ status: "claimed" })
        .eq("id", claim.item_id as string)
        .eq("status", "open");

      await createNotification({
        userId: claim.claimer_id as string,
        type: "claim_approved",
        title: "Claim approved",
        body: "Your claim was approved. You can now coordinate pickup and confirm receipt once returned.",
      });
    } else {
      await createNotification({
        userId: claim.claimer_id as string,
        type: "claim_rejected",
        title: "Claim rejected",
        body: "Your claim was rejected. If you believe this is a mistake, submit a new claim with clearer proof.",
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
