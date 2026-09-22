import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supports two ZP CSV export formats:
//   Format A: "First Name","Last Name","Email","Phone","Status"
//   Format B: "Name","Email","Phone","Status","Signed Documents"
// HTML entities in phone numbers (e.g. &#x28; = '(') are decoded.

interface ZpRow {
  name: string;
  email: string;
  phone: string;
  status: string;
}

function decodeHtmlEntities(s: string): string {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function parseCols(line: string): string[] {
  const cols: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuote = !inQuote; continue; }
    if (ch === "," && !inQuote) { cols.push(cur); cur = ""; continue; }
    cur += ch;
  }
  cols.push(cur);
  return cols.map((c) => decodeHtmlEntities(c.trim()));
}

function parseCSV(text: string): ZpRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = parseCols(lines[0]).map((h) => h.toLowerCase());
  const hasFirstLast = header.includes("first name") || header.includes("last name");

  return lines.slice(1).map((line) => {
    const cols = parseCols(line);
    if (hasFirstLast) {
      // Format A: First Name, Last Name, Email, Phone, Status
      const firstName = cols[0] ?? "";
      const lastName = cols[1] ?? "";
      return {
        name: `${firstName} ${lastName}`.trim(),
        email: (cols[2] ?? "").toLowerCase(),
        phone: cols[3] ?? "",
        status: cols[4] ?? "",
      };
    } else {
      // Format B: Name, Email, Phone, Status, Signed Documents
      return {
        name: cols[0] ?? "",
        email: (cols[1] ?? "").toLowerCase(),
        phone: cols[2] ?? "",
        status: cols[3] ?? "",
      };
    }
  }).filter((r) => r.email.includes("@"));
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "TC-";
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function callBfnInternal(path: string, body: Record<string, unknown>) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return;
  await fetch(`https://bigfrogbjj.com/api/internal/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-internal-secret": secret },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const tcAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Auth: internal secret OR logged-in admin
  const internalSecret = process.env.INTERNAL_API_SECRET;
  const headerSecret = request.headers.get("x-internal-secret");
  const isInternalCall = internalSecret && headerSecret === internalSecret;

  if (!isInternalCall) {
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

    const { data: adminMember } = await tcAdmin
      .from("members")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (!adminMember?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Parse CSV from form body
  const formData = await request.formData();
  const file = formData.get("csv") as File | null;
  if (!file) return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });

  const text = await file.text();
  const rows = parseCSV(text);
  if (rows.length === 0) return NextResponse.json({ error: "No valid rows in CSV" }, { status: 400 });

  const bfnAdmin = createClient(
    process.env.BFN_SUPABASE_URL!,
    process.env.BFN_SUPABASE_SERVICE_ROLE_KEY!
  );

  let tcProvisioned = 0;
  let bfnProvisioned = 0;
  let brevoSynced = 0;
  const errors: string[] = [];

  // Fetch all existing users + members rows once
  const { data: { users: allTcUsers } } = await tcAdmin.auth.admin.listUsers({ perPage: 10000 });
  const { data: { users: allBfnUsers } } = await bfnAdmin.auth.admin.listUsers({ perPage: 10000 });
  const tcUserMap = new Map(allTcUsers.map((u) => [u.email?.toLowerCase(), u]));
  const bfnUserMap = new Map(allBfnUsers.map((u) => [u.email?.toLowerCase(), u]));

  // Track which emails have already had a welcome email sent
  const { data: existingMembers } = await tcAdmin.from("members").select("email, welcome_sent");
  const welcomeSentSet = new Set(
    (existingMembers ?? []).filter((m) => m.welcome_sent).map((m) => m.email?.toLowerCase())
  );

  for (const row of rows) {
    const isActive = row.status === "Student";

    try {
      // --- TC Supabase ---
      const tcUser = tcUserMap.get(row.email.toLowerCase());

      if (isActive) {
        const isNewMember = !tcUser;
        const alreadyWelcomed = welcomeSentSet.has(row.email.toLowerCase());
        const sendWelcome = isNewMember && !alreadyWelcomed;
        const tempPassword = sendWelcome ? generateTempPassword() : null;
        let tcUserId: string;

        if (tcUser) {
          tcUserId = tcUser.id;
        } else {
          const { data: newUser, error } = await tcAdmin.auth.admin.createUser({
            email: row.email,
            email_confirm: true,
            password: tempPassword!,
            user_metadata: { full_name: row.name },
          });
          if (error || !newUser.user) {
            errors.push(`TC create failed for ${row.email}: ${error?.message}`);
            continue;
          }
          tcUserId = newUser.user.id;
          tcUserMap.set(row.email.toLowerCase(), newUser.user);
        }

        await tcAdmin.from("members").upsert(
          {
            id: tcUserId,
            email: row.email,
            full_name: row.name || row.email,
            active: true,
            is_tc_member: true,
            ...(sendWelcome ? { welcome_sent: true } : {}),
          },
          { onConflict: "id" }
        );
        if (sendWelcome) welcomeSentSet.add(row.email.toLowerCase());
        tcProvisioned++;

        // --- BFN Supabase ---
        const bfnUser = bfnUserMap.get(row.email.toLowerCase());

        let bfnUserId: string | undefined;
        if (bfnUser) {
          bfnUserId = bfnUser.id;
        } else {
          const { data: newBfnUser, error } = await bfnAdmin.auth.admin.createUser({
            email: row.email,
            email_confirm: true,
            user_metadata: { full_name: row.name },
          });
          if (error || !newBfnUser.user) {
            errors.push(`BFN create failed for ${row.email}: ${error?.message}`);
          } else {
            bfnUserId = newBfnUser.user.id;
            bfnUserMap.set(row.email.toLowerCase(), newBfnUser.user);
          }
        }

        if (bfnUserId) {
          await bfnAdmin.from("members").upsert(
            {
              id: bfnUserId,
              email: row.email,
              full_name: row.name || row.email,
              gym_id: process.env.BFN_TC_GYM_ID,
              tier: "nation",
              status: "active",
            },
            { onConflict: "id" }
          );
          bfnProvisioned++;
        }

        // --- Brevo via BFN (tag + welcome email for brand-new members only) ---
        await callBfnInternal("tag-tc-member", {
          email: row.email,
          name: row.name,
          phone: row.phone,
          isNew: sendWelcome,
          tempPassword,
        });
        brevoSynced++;
      } else {
        // Inactive: deactivate in TC, revoke BFN gym access, remove from Brevo TC list
        if (tcUser) {
          await tcAdmin.from("members").update({ active: false, is_tc_member: false }).eq("id", tcUser.id);
        }
        const bfnUser = bfnUserMap.get(row.email.toLowerCase());
        if (bfnUser) {
          await bfnAdmin.from("members").update({ gym_id: null, status: "inactive" }).eq("id", bfnUser.id);
        }
        await callBfnInternal("untag-tc-member", { email: row.email });
      }
    } catch (err) {
      errors.push(`Error processing ${row.email}: ${String(err)}`);
    }
  }

  return NextResponse.json({
    ok: true,
    total: rows.length,
    tcProvisioned,
    bfnProvisioned,
    brevoSynced,
    errors: errors.slice(0, 20),
  });
}
