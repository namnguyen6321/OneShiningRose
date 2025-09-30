import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchVideos } from '../api/video'

export type Video = {
  id: string
  title: string
  platform: string
  hashtag?: string
  url: string
  views?: string
  timeAgo?: string
  thumbnail?: string
  avatar?: string
  duration?: string
  category?: string
}

type Query = {
  page?: number
  limit?: number
  q?: string
  platform?: string
  hashtag?: string
  sort?: string
}

export function useVideos(initial: Query = {}) {
  const route = useRoute()
  const router = useRouter()

  const page = ref(Number(route.query.page ?? initial.page ?? 1))
  const limit = ref(Number(route.query.limit ?? initial.limit ?? 12))
  const q = ref(String(route.query.q ?? initial.q ?? ''))
  const platform = ref(String(route.query.platform ?? initial.platform ?? ''))
  const hashtag = ref(String(route.query.hashtag ?? initial.hashtag ?? ''))
  const sort = ref(String(route.query.sort ?? initial.sort ?? ''))

  const videos = ref<Video[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchVideos({
        page: page.value,
        limit: limit.value,
        q: q.value,
        platform: platform.value,
        hashtag: hashtag.value,
        sort: sort.value,
      })
      videos.value = result.data
      total.value = result.meta?.total || 0
    } catch (e: any) {
      error.value = e.message || 'Lỗi lấy dữ liệu video'
    }
    loading.value = false
  }

  // Gọi fetchAll khi khởi tạo
  fetchAll()

  const setPage = (p: number) => {
    if (p < 1) return
    page.value = p
    router.replace({ query: { ...route.query, page: String(page.value) } })
    fetchAll()
  }

  const setQuery = (text: string) => {
    q.value = text
    router.replace({ query: { ...route.query, q: text, page: '1' } })
    page.value = 1
    fetchAll()
  }

  return { videos, loading, error, page, limit, setPage, setQuery, fetchAll, total }
}




