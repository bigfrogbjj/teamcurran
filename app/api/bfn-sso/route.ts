import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Generates a BF Nation magic link for the currently logged-in TC member
// and redirects them to bigfrogbjj.com/watch/library
export async function GET() {
  const cookieStore = await cookies();

  const tcSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await tcSupabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.redirect(new URL("/members/login", process.env.NEXT_PUBLIC_SITE_URL || "https://teamcurran.com"));
  }

  const bfnAdmin = createClient(
    process.env.BFN_SUPABASE_URL!,
    process.env.BFN_SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await bfnAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: user.email,
    options: {
      redirectTo: "https://bigfrogbjj.com/auth/callback?next=/watch/library",
    },
  });

  if (error || !data?.properties?.action_link) {
    console.error("BFN SSO error:", error);
    // Fallback: send them to BFN login page directly
    return NextResponse.redirect("https://bigfrogbjj.com/sign-in?redirect=/watch/library");
  }

  return NextResponse.redirect(data.properties.action_link);
}
