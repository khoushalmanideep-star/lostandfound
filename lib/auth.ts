import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data: dbUser } = await supabase.from("users").select("role").eq("clerk_id", userId).single();

  if (dbUser?.role !== "admin") {
    redirect("/dashboard");
  }

  return { userId };
}
