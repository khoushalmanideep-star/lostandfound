import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ role: null }, { status: 200 });
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data } = await supabase.from("users").select("role").eq("clerk_id", userId).single();

  return NextResponse.json({ role: data?.role ?? null }, { status: 200 });
}
