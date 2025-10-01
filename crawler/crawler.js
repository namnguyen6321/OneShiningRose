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
    if (videos.length === 0) {
      console.log("📭 Không có video để gửi");
      return;
    }

    console.log("📤 Đang gửi", videos.length, "video đến backend...");
    console.log("🔗 URL:", "http://localhost:4000/video/bulk");
    console.log("🔑 Token:", process.env.INGEST_TOKEN);
    console.log("📝 Data mẫu:", videos[0]); // Log video đầu tiên

    const response = await axios.post("http://localhost:4000/video/bulk", videos, {
      headers: { 
        "x-ingest-token": process.env.INGEST_TOKEN,
        "Content-Type": "application/json"
      },
      timeout: 10000
    });
    
    console.log("✅ Status:", response.status);
    console.log("✅ Response từ BE:", JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error("❌ Lỗi chi tiết:");
    console.error("📍 Message:", error.message);
    
    if (error.response) {
      console.error("📍 Status:", error.response.status);
      console.error("📍 Data:", error.response.data);
    } else if (error.request) {
      console.error("📍 No response received");
    }
    console.error("📍 Config:", error.config?.url);
  }
}

(async () => {
  const videos = await fetchTrendingVideos();
  await sendToBackend(videos);
})();
