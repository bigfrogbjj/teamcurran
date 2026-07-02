import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { fetchLibraryVideos, PROGRAMS, BELT_ACCESS, BELTS, formatDuration, type Belt, type Program } from "../../../lib/vimeo";
import LibraryClient from "./LibraryClient";

async function getMember() {
  const cookieStore = await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key) => cookieStore.get(key)?.value ?? null,
          setItem: () => {},
          removeItem: () => {},
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await admin
    .from("members")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export default async function LibraryPage() {
  const member = await getMember();
  if (!member) redirect("/members");
  if (!member.active) redirect("/members?inactive=1");

  const belt: Belt = member.belt ?? "white";
  const allowedPrograms = BELT_ACCESS[belt];
  const allVideos = await fetchLibraryVideos();
  const videos = allVideos.filter((v) => allowedPrograms.includes(v.program));

  return (
    <LibraryClient
      videos={videos}
      belt={belt}
      memberName={member.full_name}
      allowedPrograms={allowedPrograms as Program[]}
    />
  );
}
