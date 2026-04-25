import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, message, proof } = (await req.json()) as {
      itemId?: string;
      message?: string;
      proof?: string;
    };

    const parsedItemId = (itemId ?? "").trim();
    const parsedMessage = (message ?? "").trim();
    const parsedProof = (proof ?? "").trim();

    if (!parsedItemId || !parsedMessage || !parsedProof) {
      return NextResponse.json({ error: "Item, message, and proof are required." }, { status: 400 });
    }

    const profile = await currentUser();
    const email = profile?.emailAddresses[0]?.emailAddress ?? `${userId}@clerk.local`;
    const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Student";

    const supabase = createServiceRoleSupabaseClient();

    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id,status,type,user_id,title")
      .eq("id", parsedItemId)
      .eq("type", "found")
      .single();

    if (itemError || !item || item.status !== "open") {
      return NextResponse.json({ error: "This item is not available for claims." }, { status: 400 });
    }

    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          clerk_id: userId,
          name,
          email,
        },
        { onConflict: "clerk_id" },
      )
      .select("id")
      .single();

    if (userError || !userRecord) {
      return NextResponse.json({ error: "Failed to prepare user account." }, { status: 500 });
    }

    const { error: claimError } = await supabase.from("claims").insert({
      item_id: parsedItemId,
      claimer_id: userRecord.id,
      message: parsedMessage,
      proof: parsedProof,
      status: "pending",
    });

    if (claimError) {
      return NextResponse.json({ error: "Could not submit claim request." }, { status: 500 });
    }

    const ownerId = String(item.user_id ?? "");
    if (ownerId && ownerId !== userRecord.id) {
      await createNotification({
        userId: ownerId,
        type: "claim_received",
        title: "New claim received",
        body: `${name} submitted a claim for "${String(item.title ?? "your found item")}". Review it in /claims.`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
