import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Zen Planner Remote Login SSO
// ZP POSTs member info + HMAC signature → validate → log member into TC → redirect to dashboard

export async function POST(request: NextRequest) {
  const secret = process.env.ZP_REMOTE_LOGIN_SECRET;
  if (!secret) return NextResponse.json({ error: "Misconfigured" }, { status: 500 });

  // Log raw body for debugging ZP's signing format
  const rawBody = await request.text();
  console.log("[ZP Remote Login] raw body:", rawBody);
  console.log("[ZP Remote Login] content-type:", request.headers.get("content-type"));

  // Parse form data from raw body
  const params = new URLSearchParams(rawBody);
  const email = params.get("email");
  const signature = params.get("signature");
  const timestamp = params.get("timestamp");

  console.log("[ZP Remote Login] email:", email, "timestamp:", timestamp, "signature:", signature);

  if (!email || !signature || !timestamp) {
    console.log("[ZP Remote Login] missing fields");
    return NextResponse.redirect(new URL("/members/login?error=missing", request.url));
  }

  // Try multiple signing formats ZP might use
  const candidates = [
    `${email}${timestamp}`,
    `${timestamp}${email}`,
    email,
    timestamp,
  ];
  const expectedHex = candidates.map((s) => ({
    input: s,
    hex: crypto.createHmac("sha256", secret).update(s).digest("hex"),
    b64: crypto.createHmac("sha256", secret).update(s).digest("base64"),
  }));
  console.log("[ZP Remote Login] signature candidates:", JSON.stringify(expectedHex));

  // Use the first format (email+timestamp) as primary — adjust based on logs
  const expected = expectedHex[0].hex;
  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expected, "hex");

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(expBuf, sigBuf)) {
    console.log("[ZP Remote Login] signature mismatch. received:", signature, "expected candidates above");
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
