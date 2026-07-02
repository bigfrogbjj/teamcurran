import LibraryClient from "./LibraryClient";
import { fetchLibraryVideos } from "../../../lib/vimeo";

export default async function LibraryPage() {
  let videos = [];
  try {
    videos = await fetchLibraryVideos();
  } catch (e) {
    console.error("Vimeo fetch error:", e);
  }

  return <LibraryClient videos={videos} />;
}
