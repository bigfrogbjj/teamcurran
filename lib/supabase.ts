import { createClient } from "@supabase/supabase-js";

export type MemberProfile = {
  id: string;
  email: string;
  full_name: string;
  belt: "white" | "blue" | "purple" | "brown" | "black";
  active: boolean;
  created_at: string;
};

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
