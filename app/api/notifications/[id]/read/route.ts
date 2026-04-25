import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function PATCH(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const notificationId = (id ?? "").trim();
    if (!notificationId) return NextResponse.json({ error: "Invalid notification id." }, { status: 400 });

    const supabase = createServiceRoleSupabaseClient();
    const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", userId).single();
    if (!dbUser?.id) return NextResponse.json({ error: "User profile not found." }, { status: 400 });

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", dbUser.id);

    if (error) return NextResponse.json({ error: "Failed to update notification." }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

