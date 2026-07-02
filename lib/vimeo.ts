export type VimeoVideo = {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  pictures: { sizes: { width: number; link: string }[] };
  embed: { html: string };
};

export type Category = "fundamentals" | "advanced" | "retreats" | "extras";

export type LibraryVideo = {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  embedHtml: string;
  category: Category;
  classNumber?: number;      // for fundamentals sorting
  retreatYear?: string;      // for retreats grouping
};

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function classifyVideo(title: string): { category: Category; classNumber?: number; retreatYear?: string } {
  const t = title.toLowerCase();

  // Fundamentals: "Class 01" through "Class 25"
  const classMatch = title.match(/class\s+(\d+)/i);
  if (classMatch) {
    const num = parseInt(classMatch[1]);
    if (num >= 1 && num <= 25) {
      return { category: "fundamentals", classNumber: num };
    }
  }

  // Retreats: "BJJ Retreat YYYY Day X" or "Name Day X" or "BF24" (Big Frog retreat)
  const retreatMatch = title.match(/retreat.*?(20\d\d)/i) || title.match(/(20\d\d).*?retreat/i);
  if (retreatMatch) {
    return { category: "retreats", retreatYear: retreatMatch[1] };
  }
  // BF24, BF25 style = Big Frog retreat 2024, 2025
  const bfMatch = title.match(/BF(\d{2})/i);
  if (bfMatch) {
    return { category: "retreats", retreatYear: `20${bfMatch[1]}` };
  }
  // "Day X" references for retreat instructors
  if (/day\s+\d/i.test(t) && !t.includes("retreat")) {
    return { category: "retreats", retreatYear: "2023" };
  }

  // Advanced / Curriculum
  if (
    t.includes("curriculum") ||
    t.includes("blue belt") ||
    t.includes("purple belt") ||
    t.includes("front headlock") ||
    t.includes("anaconda") ||
    t.includes("darce") ||
    t.includes("guillotine") ||
    t.includes("connection to back") ||
    t.includes("entering the headlock") ||
    t.includes("striking basics") ||
    t.includes("headlock series")
  ) {
    return { category: "advanced" };
  }

  return { category: "extras" };
}

export async function fetchLibraryVideos(): Promise<LibraryVideo[]> {
  const token = process.env.VIMEO_ACCESS_TOKEN;
  if (!token) throw new Error("Missing VIMEO_ACCESS_TOKEN");

  let all: VimeoVideo[] = [];
  let url = `https://api.vimeo.com/me/videos?per_page=100&fields=uri,name,description,duration,pictures,embed`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Vimeo API error: ${res.status}`);
    const data = await res.json();
    all = all.concat(data.data ?? []);
    url = data.paging?.next ? `https://api.vimeo.com${data.paging.next}` : "";
  }

  // Filter out non-content videos
  const excluded = ["jci homepage", "how to create", "save the date", "bjjreports", "preview", "welcome", "documentary", "road frog", "savannah"];

  return all
    .filter((v) => !excluded.some((ex) => v.name.toLowerCase().includes(ex)))
    .map((v) => {
      const thumb = v.pictures?.sizes?.find((s) => s.width >= 640)?.link ?? v.pictures?.sizes?.[0]?.link ?? "";
      const { category, classNumber, retreatYear } = classifyVideo(v.name);
      return {
        id: v.uri.replace("/videos/", ""),
        title: v.name,
        description: v.description ?? "",
        duration: v.duration,
        thumbnail: thumb,
        embedHtml: v.embed?.html ?? "",
        category,
        classNumber,
        retreatYear,
      };
    });
}
