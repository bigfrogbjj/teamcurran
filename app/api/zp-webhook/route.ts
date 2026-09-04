import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Zen Planner People webhook handler
// Provisions/updates TC Supabase accounts and BF Nation accounts when member status changes

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const secret = process.env.ZP_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Misconfigured" }, { status: 500 });

  const rawBody = await request.text();
  const signature = request.headers.get("x-zp-signature") ?? "";

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ZP People webhook fields — adjust to match actual ZP payload field names
  const email = (payload.email ?? payload.Email ?? payload.emailAddress) as string | undefined;
  const firstName = (payload.firstName ?? payload.first_name ?? "") as string;
  const lastName = (payload.lastName ?? payload.last_name ?? "") as string;
  const fullName = `${firstName} ${lastName}`.trim();
  const status = (payload.membershipStatus ?? payload.membership_status ?? payload.status ?? "") as string;
  const isActive = ["Active", "Current"].includes(status);

  if (!email) {
    return NextResponse.json({ error: "No email in payload" }, { status: 400 });
  }

  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const bfnAdmin = createClient(
    process.env.BFN_SUPABASE_URL!,
    process.env.BFN_SUPABASE_SERVICE_ROLE_KEY!
  );

  if (isActive) {
    // 1. Provision TC account
    const { data: { users: tcUsers } } = await tcAdmin.auth.admin.listUsers();
    const tcUser = tcUsers.find((u) => u.email === email);

    let tcUserId: string;
    if (tcUser) {
      tcUserId = tcUser.id;
    } else {
      const { data: newUser, error } = await tcAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      if (error || !newUser.user) {
        console.error("Failed to create TC user:", error);
        return NextResponse.json({ error: "Failed to create TC account" }, { status: 500 });
      }
      tcUserId = newUser.user.id;
    }

    await tcAdmin.from("members").upsert(
      { id: tcUserId, email, full_name: fullName || email, active: true, is_tc_member: true, belt: "white" },
      { onConflict: "id" }
    );

    // 2. Provision BF Nation account
    const { data: { users: bfnUsers } } = await bfnAdmin.auth.admin.listUsers();
    const bfnUser = bfnUsers.find((u) => u.email === email);

    let bfnUserId: string;
    if (bfnUser) {
      bfnUserId = bfnUser.id;
    } else {
      const { data: newBfnUser, error } = await bfnAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      if (error || !newBfnUser.user) {
        console.error("Failed to create BFN user:", error);
        return NextResponse.json({ error: "Failed to create BFN account" }, { status: 500 });
      }
      bfnUserId = newBfnUser.user.id;
    }

    // BFN_TC_GYM_ID = UUID of Team Curran's row in the nation_gyms table
    await bfnAdmin.from("members").upsert(
      { id: bfnUserId, email, full_name: fullName || email, gym_id: process.env.BFN_TC_GYM_ID, tier: "nation" },
      { onConflict: "id" }
    );

    console.log(`Provisioned active member: ${email}`);
  } else {
    // Member went inactive
    const { data: { users: tcUsers } } = await tcAdmin.auth.admin.listUsers();
    const tcUser = tcUsers.find((u) => u.email === email);
    if (tcUser) {
      await tcAdmin.from("members").update({ active: false, is_tc_member: false }).eq("id", tcUser.id);
    }

    const { data: { users: bfnUsers } } = await bfnAdmin.auth.admin.listUsers();
    const bfnUser = bfnUsers.find((u) => u.email === email);
    if (bfnUser) {
      await bfnAdmin.from("members").update({ gym_id: null }).eq("id", bfnUser.id);
    }

    console.log(`Deactivated member: ${email}`);
  }

  return NextResponse.json({ ok: true });
}
