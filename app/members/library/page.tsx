import LibraryClient from "./LibraryClient";
import { fetchLibraryVideos, fetchShowcases, type LibraryVideo, type VimeoShowcase } from "../../../lib/vimeo";

export default async function LibraryPage() {
  let videos: LibraryVideo[] = [];
  let showcases: VimeoShowcase[] = [];
  try {
    [videos, showcases] = await Promise.all([fetchLibraryVideos(), fetchShowcases()]);
  } catch (e) {
    console.error("Vimeo fetch error:", e);
  }

  return <LibraryClient videos={videos} showcases={showcases} />;
}
