import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Zen Planner Remote Login SSO
// ZP POSTs member info + HMAC signature → validate → log member into TC → redirect to dashboard

export async function POST(request: NextRequest) {
  const secret = process.env.ZP_REMOTE_LOGIN_SECRET;
  if (!secret) return NextResponse.json({ error: "Misconfigured" }, { status: 500 });

  const formData = await request.formData();
  const email = formData.get("email") as string | null;
  const signature = formData.get("signature") as string | null;
  const timestamp = formData.get("timestamp") as string | null;

  if (!email || !signature || !timestamp) {
    return NextResponse.redirect(new URL("/members/login?error=missing", request.url));
  }

  // ZP signs: HMAC-SHA256(email + timestamp, shared_secret)
  // Adjust the signed string format to match ZP's actual spec
  const signedString = `${email}${timestamp}`;
  const expected = crypto.createHmac("sha256", secret).update(signedString).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return NextResponse.redirect(new URL("/members/login?error=invalid", request.url));
  }

  // Reject stale requests (>5 minutes old)
  const ts = parseInt(timestamp, 10);
  if (Math.abs(Date.now() / 1000 - ts) > 300) {
    return NextResponse.redirect(new URL("/members/login?error=expired", request.url));
  }

  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Generate a magic link for this email so they're logged into TC
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teamcurran.com";
  const { data, error } = await tcAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${siteUrl}/members` },
  });

  if (error || !data?.properties?.action_link) {
    console.error("ZP remote login error:", error);
    return NextResponse.redirect(new URL("/members/login", request.url));
  }

  return NextResponse.redirect(data.properties.action_link);
}
