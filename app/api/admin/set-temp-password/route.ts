import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const tcSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: { user } } = await tcSupabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: adminMember } = await tcAdmin.from("members").select("is_admin").eq("id", user.id).single();
  if (!adminMember?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: "email and password required" }, { status: 400 });

  // Find the user in TC auth
  const { data: { users } } = await tcAdmin.auth.admin.listUsers({ perPage: 10000 });
  const existing = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

  let userId: string;
  if (existing) {
    const { error } = await tcAdmin.auth.admin.updateUserById(existing.id, { password });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    userId = existing.id;
  } else {
    // Create account if it doesn't exist
    const { data: newUser, error } = await tcAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      password,
      user_metadata: {},
    });
    if (error || !newUser.user) return NextResponse.json({ error: error?.message || "Create failed" }, { status: 500 });
    userId = newUser.user.id;
    await tcAdmin.from("members").upsert(
      { id: userId, email, full_name: email, active: true, is_tc_member: true },
      { onConflict: "id" }
    );
  }

  const { data: memberRow } = await tcAdmin.from("members").select("full_name").eq("id", userId).single();
  const name = memberRow?.full_name || email;
  const firstName = name.split(" ")[0];

  // Send email via BFN internal
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return NextResponse.json({ error: "Misconfigured" }, { status: 500 });

  const bfnRes = await fetch("https://bigfrogbjj.com/api/internal/send-tc-temp-password", {
    method: "POST",
    headers: { "content-type": "application/json", "x-internal-secret": secret },
    body: JSON.stringify({ email, name, firstName, password }),
  });

  if (!bfnRes.ok) {
    return NextResponse.json({ error: "Password set but email failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
