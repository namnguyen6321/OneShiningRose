const { google } = require("googleapis");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({ version: "v3", auth: API_KEY });

async function fetchTrendingVideos() {
  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      chart: "mostPopular",
      regionCode: "VN",
      maxResults: 100,
    });

    const videos = response.data.items.map((video) => {
      const hashtags =
        video.snippet.tags?.filter((t) => t.startsWith("#")) || [];

      return {
        platform: "youtube",
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails?.medium?.url || "",
        views: parseInt(video.statistics?.viewCount || "0", 10),
        likes: parseInt(video.statistics?.likeCount || "0", 10),
        hashtags,
        watched: false, // ✅ mặc định
      };
    });

    console.log("🎬 Lấy dữ liệu thành công:");
    videos.forEach((v, i) =>
      console.log(
        `${i + 1}. ${v.title} | Views: ${v.views} | Likes: ${v.likes}`
      )
    );

    return videos;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy dữ liệu từ YouTube:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function sendToBackend(videos) {
  try {
    if (videos.length === 0) return;
  await axios.post("http://localhost:4000/video/bulk", videos, {
      headers: { "X-Ingest-Token": process.env.INGEST_TOKEN },
    });
    console.log("✅ Đã gửi dữ liệu về backend");
  } catch (error) {
    console.error(
      "❌ Lỗi khi gửi dữ liệu về backend:",
      error.response?.data || error.message
    );
  }
}

(async () => {
  const videos = await fetchTrendingVideos();
  await sendToBackend(videos);
})();
