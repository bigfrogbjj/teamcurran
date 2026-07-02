export type VimeoVideo = {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  pictures: { sizes: { width: number; link: string }[] };
  embed: { html: string };
};

export type Category = "fundamentals" | "white-to-blue" | "blue-to-purple" | "advanced" | "retreats" | "extras";

export type LibraryVideo = {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  embedHtml: string;
  category: Category;
  classNumber?: number;
  retreatYear?: string;
  extrasDate?: string;       // for extras grouping e.g. "2023-04-13"
};

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function extractExtrasDate(title: string): string | undefined {
  // Matches "04.13.2023", "04.18.23", "4.11.2023", "4.7.2023"
  const m = title.match(/(\d{1,2})\.(\d{2})\.(\d{2,4})/);
  if (!m) return undefined;
  const year = m[3].length === 2 ? `20${m[3]}` : m[3];
  const month = m[1].padStart(2, "0");
  const day = m[2].padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function classifyVideo(title: string): { category: Category; classNumber?: number; retreatYear?: string; extrasDate?: string } {
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

  // White to Blue: the blue belt test material
  if (t.includes("blue belt test") || t.includes("blue belt material") || (t.includes("blue") && t.includes("full list"))) {
    return { category: "white-to-blue" };
  }

  // Blue to Purple: the purple belt test material
  if (t.includes("purple belt") || (t.includes("purple") && t.includes("test"))) {
    return { category: "blue-to-purple" };
  }

  // Advanced / Curriculum
  if (
    t.includes("curriculum") ||
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

  const extrasDate = extractExtrasDate(title);
  return { category: "extras", extrasDate };
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
      const { category, classNumber, retreatYear, extrasDate } = classifyVideo(v.name);
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
        extrasDate,
      };
    });
}
