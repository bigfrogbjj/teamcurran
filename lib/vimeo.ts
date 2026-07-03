export type VimeoVideo = {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  pictures: { sizes: { width: number; link: string }[] };
  embed: { html: string };
};

export type Category = "fundamentals" | "white-to-blue" | "blue-to-purple" | "advanced" | "striking" | "retreats" | "extras";

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

  // White to Blue: blue belt test material + fundamental curriculum full list
  if (t.includes("blue belt test") || t.includes("blue belt material") || (t.includes("blue") && t.includes("full list")) || t.includes("fundamental curriculum")) {
    return { category: "white-to-blue" };
  }

  // Blue to Purple: the purple belt test material
  if (t.includes("purple belt") || (t.includes("purple") && t.includes("test"))) {
    return { category: "blue-to-purple" };
  }

  // Striking Basics
  if (t.includes("striking basics") || t.includes("striking")) {
    return { category: "striking" };
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
    t.includes("headlock series")
  ) {
    return { category: "advanced" };
  }

  const extrasDate = extractExtrasDate(title);
  return { category: "extras", extrasDate };
}

export type VimeoShowcase = {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string;
  videoCount: number;
  videos: LibraryVideo[];
};

export async function fetchShowcases(): Promise<VimeoShowcase[]> {
  const token = process.env.VIMEO_ACCESS_TOKEN;
  if (!token) throw new Error("Missing VIMEO_ACCESS_TOKEN");

  const res = await fetch(
    `https://api.vimeo.com/me/albums?per_page=100&fields=uri,name,description,pictures,metadata`,
    { headers: { Authorization: `bearer ${token}` }, next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`Vimeo showcases error: ${res.status}`);
  const data = await res.json();

  const showcases: VimeoShowcase[] = [];

  for (const album of data.data ?? []) {
    const id = album.uri.replace("/albums/", "");
    const thumb = album.pictures?.sizes?.find((s: { width: number; link: string }) => s.width >= 640)?.link ?? album.pictures?.sizes?.[0]?.link ?? "";
    const videoCount = album.metadata?.connections?.videos?.total ?? 0;

    // Fetch videos in this showcase
    let allVids: VimeoVideo[] = [];
    let vUrl: string | null = `https://api.vimeo.com/albums/${id}/videos?per_page=100&fields=uri,name,description,duration,pictures,embed,privacy`;
    while (vUrl) {
      const vRes: Response = await fetch(vUrl, { headers: { Authorization: `bearer ${token}` }, next: { revalidate: 300 } });
      const vData = vRes.ok ? await vRes.json() : { data: [] };
      allVids = allVids.concat(vData.data ?? []);
      vUrl = vData.paging?.next ? `https://api.vimeo.com${vData.paging.next}` : null;
    }
    const vData = { data: allVids };

    const videos: LibraryVideo[] = (vData.data ?? []).map((v: VimeoVideo) => {
      const vthumb = v.pictures?.sizes?.find((s: { width: number; link: string }) => s.width >= 640)?.link ?? v.pictures?.sizes?.[0]?.link ?? "";
      const videoId = v.uri.replace("/videos/", "");
      const embedHtml = v.embed?.html || `<iframe src="https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      return {
        id: videoId,
        title: v.name,
        description: v.description || "",
        duration: v.duration,
        thumbnail: vthumb,
        embedHtml,
        category: "extras" as Category,
      };
    });

    showcases.push({ id, name: album.name, description: album.description ?? null, thumbnail: thumb, videoCount, videos });
  }

  return showcases;
}

export async function fetchLibraryVideos(): Promise<LibraryVideo[]> {
  const token = process.env.VIMEO_ACCESS_TOKEN;
  if (!token) throw new Error("Missing VIMEO_ACCESS_TOKEN");

  let all: VimeoVideo[] = [];
  let url = `https://api.vimeo.com/me/videos?per_page=100&fields=uri,name,description,duration,pictures,embed,privacy`;

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
      const videoId = v.uri.replace("/videos/", "");
      const embedHtml = v.embed?.html || `<iframe src="https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      return {
        id: videoId,
        title: v.name,
        description: v.description || "",
        duration: v.duration,
        thumbnail: thumb,
        embedHtml,
        category,
        classNumber,
        retreatYear,
        extrasDate,
      };
    });
}
