import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ZP CSV columns: "Name","Email","Phone","Status","Signed Documents"
// Status is always "Student" for active members in this export.

interface ZpRow {
  name: string;
  email: string;
  phone: string;
  status: string;
}

function parseCSV(text: string): ZpRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  // Skip header row
  return lines.slice(1).map((line) => {
    // Simple CSV parse — handles quoted fields
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
    return {
      name: cols[0]?.trim() ?? "",
      email: (cols[1]?.trim() ?? "").toLowerCase(),
      phone: cols[2]?.trim() ?? "",
      status: cols[3]?.trim() ?? "",
    };
  }).filter((r) => r.email.includes("@"));
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") ?? "",
  };
}

async function tagInBrevo(email: string, name: string, phone?: string) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return;
  await fetch("https://bigfrogbjj.com/api/internal/tag-tc-member", {
    method: "POST",
    headers: { "content-type": "application/json", "x-internal-secret": secret },
    body: JSON.stringify({ email, name, phone }),
  }).catch(() => {});
}

export async function POST(request: NextRequest) {
  // Auth: must be an is_admin member
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

  for (const row of rows) {
    const isActive = row.status === "Student";

    try {
      // --- TC Supabase ---
      const { data: { users: tcUsers } } = await tcAdmin.auth.admin.listUsers();
      const tcUser = tcUsers.find((u) => u.email === row.email);

      if (isActive) {
        let tcUserId: string;
        if (tcUser) {
          tcUserId = tcUser.id;
        } else {
          const { data: newUser, error } = await tcAdmin.auth.admin.createUser({
            email: row.email,
            email_confirm: true,
            user_metadata: { full_name: row.name },
          });
          if (error || !newUser.user) {
            errors.push(`TC create failed for ${row.email}: ${error?.message}`);
            continue;
          }
          tcUserId = newUser.user.id;
        }

        await tcAdmin.from("members").upsert(
          { id: tcUserId, email: row.email, full_name: row.name || row.email, active: true, is_tc_member: true, belt: "white" },
          { onConflict: "id" }
        );
        tcProvisioned++;

        // --- BFN Supabase ---
        const { data: { users: bfnUsers } } = await bfnAdmin.auth.admin.listUsers();
        const bfnUser = bfnUsers.find((u) => u.email === row.email);

        let bfnUserId: string;
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
          }
        }

        if (bfnUser?.id || bfnUserId!) {
          await bfnAdmin.from("members").upsert(
            {
              id: bfnUser?.id ?? bfnUserId!,
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

        // --- Brevo via BFN ---
        await tagInBrevo(row.email, row.name, row.phone);
        brevoSynced++;
      } else {
        // Inactive: deactivate in TC, revoke BFN gym access
        if (tcUser) {
          await tcAdmin.from("members").update({ active: false, is_tc_member: false }).eq("id", tcUser.id);
        }
        const { data: { users: bfnUsers } } = await bfnAdmin.auth.admin.listUsers();
        const bfnUser = bfnUsers.find((u) => u.email === row.email);
        if (bfnUser) {
          await bfnAdmin.from("members").update({ gym_id: null, status: "inactive" }).eq("id", bfnUser.id);
        }
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
