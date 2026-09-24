import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: adminMember } = await tcAdmin
    .from("members")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!adminMember?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  // Generate a magic link via Supabase admin
  const { data, error } = await tcAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://teamcurran.com/members" },
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: error?.message || "Failed to generate link" }, { status: 500 });
  }

  const magicLink = data.properties.action_link;

  // Send via BFN internal endpoint
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return NextResponse.json({ error: "Misconfigured" }, { status: 500 });

  const { data: memberRow } = await tcAdmin
    .from("members")
    .select("full_name")
    .eq("email", email)
    .single();

  const name = memberRow?.full_name || email;
  const firstName = name.split(" ")[0];

  const bfnRes = await fetch("https://bigfrogbjj.com/api/internal/send-tc-login-link", {
    method: "POST",
    headers: { "content-type": "application/json", "x-internal-secret": secret },
    body: JSON.stringify({ email, name, firstName, magicLink }),
  });

  if (!bfnRes.ok) {
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
