export type VimeoVideo = {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  pictures: { sizes: { width: number; link: string }[] };
  embed: { html: string };
  tags: { name: string }[];
  privacy: { view: string };
};

export type LibraryVideo = {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  embedHtml: string;
  tags: string[];
  program: Program;
  beltRequired: Belt;
};

export type Program = "fundamentals" | "advanced" | "gi" | "nogi" | "muay-thai";
export type Belt = "white" | "blue" | "purple" | "brown" | "black";

export const PROGRAMS: { key: Program; label: string; color: string }[] = [
  { key: "fundamentals", label: "Fundamentals", color: "bg-gray-600" },
  { key: "gi", label: "Gi", color: "bg-blue-700" },
  { key: "nogi", label: "No-Gi", color: "bg-green-700" },
  { key: "advanced", label: "Advanced", color: "bg-purple-700" },
  { key: "muay-thai", label: "Muay Thai", color: "bg-red-700" },
];

export const BELTS: { key: Belt; label: string; color: string }[] = [
  { key: "white", label: "White Belt", color: "bg-white text-black" },
  { key: "blue", label: "Blue Belt", color: "bg-blue-600" },
  { key: "purple", label: "Purple Belt", color: "bg-purple-600" },
  { key: "brown", label: "Brown Belt", color: "bg-amber-800" },
  { key: "black", label: "Black Belt", color: "bg-gray-900 border border-gray-600" },
];

// Belt access hierarchy — each belt can see its own level and below
export const BELT_ACCESS: Record<Belt, Program[]> = {
  white: ["fundamentals"],
  blue: ["fundamentals", "gi", "nogi"],
  purple: ["fundamentals", "gi", "nogi", "advanced"],
  brown: ["fundamentals", "gi", "nogi", "advanced", "muay-thai"],
  black: ["fundamentals", "gi", "nogi", "advanced", "muay-thai"],
};

// Map Vimeo tags to programs and belt requirements
function detectProgram(tags: string[]): Program {
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => t.includes("muay") || t.includes("thai") || t.includes("striking"))) return "muay-thai";
  if (lower.some((t) => t.includes("advanced"))) return "advanced";
  if (lower.some((t) => t.includes("nogi") || t.includes("no-gi") || t.includes("no gi"))) return "nogi";
  if (lower.some((t) => t.includes("gi") && !t.includes("nogi"))) return "gi";
  return "fundamentals";
}

function detectBelt(tags: string[]): Belt {
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => t.includes("black"))) return "black";
  if (lower.some((t) => t.includes("brown"))) return "brown";
  if (lower.some((t) => t.includes("purple"))) return "purple";
  if (lower.some((t) => t.includes("blue"))) return "blue";
  return "white";
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export async function fetchLibraryVideos(): Promise<LibraryVideo[]> {
  const token = process.env.VIMEO_ACCESS_TOKEN;
  if (!token) throw new Error("Missing VIMEO_ACCESS_TOKEN");

  let all: VimeoVideo[] = [];
  let url = `https://api.vimeo.com/me/videos?per_page=100&fields=uri,name,description,duration,pictures,embed,tags,privacy`;

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

  return all.map((v) => {
    const tags = v.tags?.map((t) => t.name) ?? [];
    const thumb = v.pictures?.sizes?.find((s) => s.width >= 640)?.link ?? v.pictures?.sizes?.[0]?.link ?? "";
    return {
      id: v.uri.replace("/videos/", ""),
      title: v.name,
      description: v.description ?? "",
      duration: v.duration,
      thumbnail: thumb,
      embedHtml: v.embed?.html ?? "",
      tags,
      program: detectProgram(tags),
      beltRequired: detectBelt(tags),
    };
  });
}
