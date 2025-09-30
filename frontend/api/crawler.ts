// frontend/api/crawler.ts
import axios from 'axios'

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000'

// Bulk create videos
export async function bulkCreateVideos(videos: any[], token: string) {
  try {
    const res = await axios.post(`${API_URL}/video/bulk`, videos, {
      headers: { 'X-Ingest-Token': token }
    })
    return res.data
  } catch (e: any) {
    throw new Error(e?.response?.data?.message || e.message || 'Bulk create failed')
  }
}

// Create single video
export async function createVideo(data: any) {
  try {
    const res = await axios.post(`${API_URL}/video`, data)
    return res.data
  } catch (e: any) {
    throw new Error(e?.response?.data?.message || e.message || 'Create video failed')
  }
}

// Fetch videos (with query)
export async function fetchVideos(query: Record<string, any> = {}) {
  try {
    const params = new URLSearchParams(query as any).toString()
    const res = await axios.get(`${API_URL}/video?${params}`)
    return res.data
  } catch (e: any) {
    throw new Error(e?.response?.data?.message || e.message || 'Fetch videos failed')
  }
}

// Mark video as watched
export async function markVideoAsWatched(uniqueKey: string) {
  try {
    const res = await axios.patch(`${API_URL}/video/${uniqueKey}/watched`)
    return res.data
  } catch (e: any) {
    throw new Error(e?.response?.data?.message || e.message || 'Mark as watched failed')
  }
}
