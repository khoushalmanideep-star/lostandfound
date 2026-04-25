import "server-only";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return key;
}

/**
 * Creates a Supabase client that enforces RLS using a Clerk JWT.
 *
 * Required Clerk setup:
 * - Create a JWT template named "supabase"
 * - Include `sub` as the Clerk `userId`
 *
 * Required Supabase setup:
 * - Configure JWT verification to accept Clerk JWTs (JWKS / secret)
 */
export async function createRlsSupabaseServerClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });
  if (!token) throw new Error("Missing Clerk Supabase JWT (template: supabase).");

  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

