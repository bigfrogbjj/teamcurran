import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Zen Planner Remote Login SSO
// ZP POSTs: username (email), firstName, lastName, timestamp, signature (HMAC-SHA512)
// Signature is HMAC-SHA512(username + timestamp, shared_secret)

export async function GET() {
  return new Response("OK", { status: 200 });
}

export async function POST(request: NextRequest) {
  const secret = process.env.ZP_REMOTE_LOGIN_SECRET;
  if (!secret) return NextResponse.json({ error: "Misconfigured" }, { status: 500 });

  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);

  // ZP sends email as "username", not "email"
  const email = params.get("username");
  const signature = params.get("signature");
  const timestamp = params.get("timestamp");
  const firstName = params.get("firstName") ?? "";
  const lastName = params.get("lastName") ?? "";

  if (!email || !signature || !timestamp) {
    console.log("[ZP Remote Login] missing fields. params:", rawBody);
    return NextResponse.redirect(new URL("/members/login?error=missing", request.url));
  }

  // ZP signs username+timestamp with HMAC-SHA512
  const signedString = `${email}${timestamp}`;
  const expected = crypto.createHmac("sha512", secret).update(signedString).digest("hex");

  if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    console.log("[ZP Remote Login] signature mismatch for:", email);
    return NextResponse.redirect(new URL("/members/login?error=invalid", request.url));
  }

  // Reject stale requests (>5 minutes old)
  const ts = parseInt(timestamp, 10);
  if (Math.abs(Date.now() / 1000 - ts) > 300) {
    return NextResponse.redirect(new URL("/members/login?error=expired", request.url));
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Generate a magic link so they're logged into TC portal
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teamcurran.com";
  const { data, error } = await tcAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${siteUrl}/members` },
  });

  if (error || !data?.properties?.action_link) {
    console.error("[ZP Remote Login] magic link error:", error, "email:", email);
    return NextResponse.redirect(new URL("/members/login", request.url));
  }

  console.log("[ZP Remote Login] success for:", email, fullName);
  return NextResponse.redirect(data.properties.action_link);
}
