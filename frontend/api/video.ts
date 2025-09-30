// frontend/api/video.ts

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchVideos(query: Record<string, any> = {}) {
  // Loại bỏ các param rỗng/null/undefined
  const cleanQuery: Record<string, any> = {};
  Object.keys(query).forEach((k) => {
    if (query[k] !== undefined && query[k] !== null && query[k] !== '') {
      cleanQuery[k] = query[k];
    }
  });
  const params = new URLSearchParams(cleanQuery as any).toString();
  const url = `${API_URL}/video${params ? '?' + params : ''}`;
  if (typeof window !== 'undefined') {
    console.log('FE fetchVideos URL:', url);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch videos');
  const json = await res.json();
  if (typeof window !== 'undefined') {
    console.log('FE fetchVideos response:', json);
  }
  // Trả về cả data và meta nếu có
  if (json && Array.isArray(json.data) && json.meta) return json;
  if (Array.isArray(json)) return { data: json, meta: { total: json.length, page: 1, limit: json.length, totalPages: 1 } };
  if (Array.isArray(json.data)) return { data: json.data, meta: { total: json.data.length, page: 1, limit: json.data.length, totalPages: 1 } };
  return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 1 } };
}

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
