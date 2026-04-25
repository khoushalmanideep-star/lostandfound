import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function DELETE(_: Request, ctx: { params: Promise<{ itemId: string }> }) {
  try {
    await requireAdmin();
    const { itemId } = await ctx.params;
    const parsedItemId = (itemId ?? "").trim();

    if (!parsedItemId) {
      return NextResponse.json({ error: "Invalid item id." }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();
    const { error } = await supabase.from("items").delete().eq("id", parsedItemId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
