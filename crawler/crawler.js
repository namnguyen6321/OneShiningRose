const { google } = require("googleapis");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});

async function fetchAndSendTrendingVideos() {
  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      chart: "mostPopular",
      regionCode: "VN",
      maxResults: 10,
    });

    const videos = response.data.items.map((video) => {
      const hashtags =
        video.snippet.tags?.filter((t) => t.startsWith("#")) || [];

      return {
        id: video.id,
        platform: "youtube",
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        views: parseInt(video.statistics?.viewCount || "0", 10),
        likes: parseInt(video.statistics?.likeCount || "0", 10),
        hashtags, // Prisma String[]
        createdAt: new Date(),
      };
    });

    // ✅ In dữ liệu ra terminal trước khi gửi về backend
    console.log("Dữ liệu đã crawl:", JSON.stringify(videos, null, 2));

    await axios.post("http://localhost:3000/videos", videos);
    console.log("✅ Đã gửi dữ liệu về backend");
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy hoặc gửi dữ liệu:",
      error.response?.data || error.message
    );
  }
}

fetchAndSendTrendingVideos();
