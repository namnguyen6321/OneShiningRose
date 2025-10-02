const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
// lấy video trending TikTok qua Apify
async function fetchTikTokTrending() {
  try {
    // ID actor của Apify (cố định)
    const actorId = "clockworks~tiktok-scraper";

    // URL endpoint để gọi actor và lấy dataset kết quả
    const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items`;

    // Gọi API TikTok trending qua Apify
    const response = await axios.post(
      url,
      {
        hashtags: ["foryou"], // lấy video từ hashtag foryou
        resultsPerPage: 10, //10 video
        shouldDownloadVideos: false, //không tải video
        shouldDownloadCovers: false, //không tải cover
        proxyCountryCode: "VN", //lọc ip vn
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.APIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const raw = response.data;
    const rawVideos = Array.isArray(raw) ? raw : raw.items || raw.data || [];

    // map dl raw về format be
    const videos = rawVideos.map((v) => {
      const hashtags =
        v.hashtags
          ?.map((h) => {
            if (typeof h === "string") return h;
            if (typeof h === "object" && h?.name) return h.name;
            return null;
          })
          .filter(Boolean) || [];

      // Lấy id video
      const id = v.id || v.video_id;

      // Lấy uniqueId của tác giả
      const authorId = v.author?.uniqueId || "";

      return {
        platform: "tiktok",
        uniqueKey: `tiktok:${id}`, // để match uniqueKey trong DB
        title: v.desc || v.text || "",
        thumbnail: v.video?.cover || v.cover || v.thumbnail || "",
        views: v.stats?.playCount || v.playCount || 0,
        likes: v.stats?.diggCount || v.diggCount || 0,

        hashtags,
        watched: false,
        videoUrl:
          authorId && id
            ? `https://www.tiktok.com/@${authorId}/video/${id}`
            : "",
        embedUrl: id ? `https://www.tiktok.com/embed/${id}` : "",
      };
    });

    console.log(
      "✅ Lấy được",
      videos.length,
      "video từ clockworks/tiktok-scraper"
    );
    return videos;
  } catch (err) {
    console.error("❌ Lỗi lấy TikTok:", err.response?.data || err.message);
    return [];
  }
}
//  còn lại giống youtube
async function sendToBackend(videos) {
  try {
    if (!videos || videos.length === 0) {
      console.log("⚠️ Không có video để gửi về backend.");
      return;
    }

    await axios.post("http://localhost:4000/video/bulk", videos, {
      headers: {
        "X-Ingest-Token": process.env.INGEST_TOKEN,
        "Content-Type": "application/json",
      },
      timeout: 30000,
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
