const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

async function fetchTikTokTrending() {
  try {
    const response = await axios.get(
      "https://tiktok-scraper7.p.rapidapi.com/feed/list",
      {
        params: { region: "VN", count: 50 },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com",
        },
      }
    );

    const videos = response.data.data.map((v) => {
      const hashtags = v.hashtags?.map((h) => `#${h.name}`) || [];
      return {
        platform: "tiktok",
        title: v.title || v.desc,
        thumbnail: v.cover,
        views: v.play_count || 0,
        likes: v.digg_count || 0,
        hashtags,
        watched: false, // ✅ mặc định
      };
    });

    console.log("🎬 TikTok trending:", videos.length, "videos");
    return videos;
  } catch (err) {
    console.error("❌ Lỗi lấy TikTok:", err.response?.data || err.message);
    return [];
  }
}

async function sendToBackend(videos) {
  try {
    if (videos.length === 0) return;
    await axios.post("http://localhost:3000/video/bulk", videos, {
      headers: { "X-Ingest-Token": process.env.INGEST_TOKEN },
    });
    console.log("✅ Đã gửi dữ liệu TikTok về backend");
  } catch (error) {
    console.error(
      "❌ Lỗi khi gửi dữ liệu về backend:",
      error.response?.data || error.message
    );
  }
}

(async () => {
  const videos = await fetchTikTokTrending();
  await sendToBackend(videos);
})();