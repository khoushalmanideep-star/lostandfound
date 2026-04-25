import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ unreadCount: 0 }, { status: 200 });

    const supabase = createServiceRoleSupabaseClient();
    const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", userId).single();

    if (!dbUser?.id) {
      return NextResponse.json({ unreadCount: 0 }, { status: 200 });
    }

    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", dbUser.id)
      .is("read_at", null);

    return NextResponse.json({ unreadCount: count ?? 0 }, { status: 200 });
  } catch {
    return NextResponse.json({ unreadCount: 0 }, { status: 200 });
  }
}
