import LibraryClient from "./LibraryClient";
import { fetchLibraryVideos, type LibraryVideo } from "../../../lib/vimeo";

export default async function LibraryPage() {
  let videos: LibraryVideo[] = [];
  try {
    videos = await fetchLibraryVideos();
  } catch (e) {
    console.error("Vimeo fetch error:", e);
  }

  return <LibraryClient videos={videos} />;
}
