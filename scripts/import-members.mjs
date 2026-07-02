/**
 * Bulk import Team Curran members from a Zen Planner CSV export.
 *
 * Usage:
 *   node scripts/import-members.mjs members.csv
 *
 * CSV must have columns (Zen Planner export):
 *   First Name, Last Name, Email, Belt/Rank, Status
 *
 * Set these env vars before running:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import readline from "readline";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const csvFile = process.argv[2];
if (!csvFile) {
  console.error("Usage: node scripts/import-members.mjs members.csv");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Map Zen Planner belt names to our belt keys
function normalizeBelt(rank) {
  const r = (rank || "").toLowerCase();
  if (r.includes("black")) return "black";
  if (r.includes("brown")) return "brown";
  if (r.includes("purple")) return "purple";
  if (r.includes("blue")) return "blue";
  return "white";
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

async function importMembers() {
  const rows = parseCSV(csvFile);
  console.log(`Found ${rows.length} rows in CSV\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    // Try common Zen Planner column name variants
    const firstName = row["First Name"] || row["FirstName"] || "";
    const lastName = row["Last Name"] || row["LastName"] || "";
    const email = (row["Email"] || row["Email Address"] || "").toLowerCase().trim();
    const rank = row["Belt"] || row["Rank"] || row["Belt/Rank"] || "White";
    const status = (row["Status"] || row["Membership Status"] || "Active").toLowerCase();

    if (!email) { skipped++; continue; }

    const active = status.includes("active");
    const belt = normalizeBelt(rank);
    const full_name = `${firstName} ${lastName}`.trim();

    // Create auth user and send invite email
    const { data: userData, error: userError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name, belt },
    });

    if (userError) {
      if (userError.message.includes("already been registered")) {
        console.log(`⚠️  Skipped (already exists): ${email}`);
        skipped++;
      } else {
        console.error(`❌ Error creating ${email}: ${userError.message}`);
        errors++;
      }
      continue;
    }

    // Insert member profile
    const { error: profileError } = await supabase.from("members").upsert({
      id: userData.user.id,
      email,
      full_name,
      belt,
      active,
    });

    if (profileError) {
      console.error(`❌ Profile error for ${email}: ${profileError.message}`);
      errors++;
    } else {
      console.log(`✅ Created: ${full_name} (${email}) — ${belt} belt — active: ${active}`);
      created++;
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n── Import complete ──`);
  console.log(`✅ Created: ${created}`);
  console.log(`⚠️  Skipped: ${skipped}`);
  console.log(`❌ Errors:  ${errors}`);
}

importMembers();
