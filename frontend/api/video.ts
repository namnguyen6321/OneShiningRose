// frontend/api/video.ts
const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchVideos(query: Record<string, any> = {}) {
  console.log('🔄 [fetchVideos] Called with query:', query)
  
  const cleanQuery: Record<string, any> = {}
  
  // 👇 SỬA LỖI TYPE
  const finalQuery: Record<string, any> = {
    page: 1,
    limit: 12,
    ...query
  }
  
  Object.keys(finalQuery).forEach((k) => {
    if (finalQuery[k] !== undefined && finalQuery[k] !== null && finalQuery[k] !== '') {
      cleanQuery[k] = finalQuery[k]
    }
  })
  
  const params = new URLSearchParams()
  Object.keys(cleanQuery).forEach(key => {
    params.append(key, cleanQuery[key])
  })
  
  const url = `${API_URL}/video/find?${params.toString()}`
  
  console.log('📡 [fetchVideos] Calling URL:', url)
  
  try {
    const res = await fetch(url)
    console.log('📦 [fetchVideos] Response status:', res.status)
    
    if (!res.ok) {
      console.error('❌ [fetchVideos] HTTP Error:', res.status, res.statusText)
      throw new Error('Failed to fetch videos')
    }
    
    const json = await res.json()
    console.log('✅ [fetchVideos] Response data:', json)
    
    return json
  } catch (error) {
    console.error('❌ [fetchVideos] Fetch error:', error)
    throw error
  }
}

// Các hàm khác giữ nguyên
export async function createVideo(data: any) {
  const res = await fetch(`${API_URL}/video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create video');
  return res.json();
}

export async function bulkCreateVideos(data: any[], token: string) {
  const res = await fetch(`${API_URL}/video/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ingest-token': token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to bulk create videos');
  return res.json();
}

export async function markVideoAsWatched(uniqueKey: string) {
  const res = await fetch(`${API_URL}/video/${uniqueKey}/watched`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to mark as watched');
  return res.json();
}