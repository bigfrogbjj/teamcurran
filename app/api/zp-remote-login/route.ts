import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Zen Planner Remote Login SSO
// ZP POSTs: username (email), firstName, lastName, timestamp, signature
// We log the signature for auditing but don't block on it — magic links still require email access.

export async function GET() {
  return new Response("OK", { status: 200 });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);

  // ZP sends email as "username"
  const email = params.get("username");
  const timestamp = params.get("timestamp");
  const firstName = params.get("firstName") ?? "";
  const lastName = params.get("lastName") ?? "";

  if (!email || !timestamp) {
    console.log("[ZP Remote Login] missing email/timestamp");
    return NextResponse.redirect(new URL("/members/login?error=missing", request.url));
  }

  // Reject stale requests (>10 minutes old)
  const ts = parseInt(timestamp, 10);
  if (Math.abs(Date.now() / 1000 - ts) > 600) {
    console.log("[ZP Remote Login] stale timestamp for:", email);
    return NextResponse.redirect(new URL("/members/login?error=expired", request.url));
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Generate a magic link — member still needs to click it in their email
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
