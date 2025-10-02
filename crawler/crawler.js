const { google } = require("googleapis");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({ version: "v3", auth: API_KEY });

//lấy video từ youtube
async function fetchTrendingVideos() {
  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      chart: "mostPopular",
      regionCode: "VN",
      maxResults: 100,
    });
    //chuyển dl từ api về định dạng phù hợp
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
        watched: false,
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
      };
    });

    console.log("✅Lấy dữ liệu thành công:");
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
//gửi dữ liệu về be
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
//chính: lấy video trending rồi gửi về be
(async () => {
  // gọi api lấy video
  const videos = await fetchTrendingVideos();
  //gửi dl về be
  await sendToBackend(videos);
})();