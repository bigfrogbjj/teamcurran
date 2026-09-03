import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export type MemberProfile = {
  id: string;
  email: string;
  full_name: string;
  belt: "white" | "blue" | "purple" | "brown" | "black";
  active: boolean;
  created_at: string;
};

// Use SSR browser client so auth cookies are set and readable by middleware/server components
export function createSupabaseClient() {
  return createBrowserClient(
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
