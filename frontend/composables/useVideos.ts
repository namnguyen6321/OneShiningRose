import { ref, computed } from 'vue'
import { useRuntimeConfig, useFetch } from 'nuxt/app'
import { useRoute, useRouter } from 'vue-router'
export type Video = {
  id: string
  title: string
  channel: string
  views: string
  timeAgo: string
  thumbnail: string
  avatar: string
  duration: string
  category?: string
}

export type Paginated<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
}

type Query = {
  page?: number
  pageSize?: number
  q?: string
  category?: string
}

export function useVideos(initial: Query = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()

  const page = ref(Number(route.query.page ?? initial.page ?? 1))
  const pageSize = ref(Number(route.query.pageSize ?? initial.pageSize ?? 12))
  const q = ref(String(route.query.q ?? initial.q ?? ''))
  const category = ref(String(route.query.category ?? initial.category ?? 'Tất cả'))

  const query = computed(() => ({ page: page.value, pageSize: pageSize.value, q: q.value, category: category.value }))

  const { data, pending, error, refresh } = useFetch<Paginated<Video>>(() => `${config.public.apiBase}/videos`, {
    query: query,
    immediate: false
  })

  const setPage = (p: number) => {
    if (p < 1) return
    page.value = p
    router.replace({ query: { ...route.query, page: String(page.value) } })
    refresh()
  }

  const next = () => setPage(page.value + 1)
  const prev = () => setPage(page.value - 1)

  const setCategory = (c: string) => {
    category.value = c
    router.replace({ query: { ...route.query, category: c, page: '1' } })
    page.value = 1
    refresh()
  }

  const setQuery = (text: string) => {
    q.value = text
    router.replace({ query: { ...route.query, q: text, page: '1' } })
    page.value = 1
    refresh()
  }

  return { data, pending, error, refresh, page, pageSize, q, category, setPage, next, prev, setCategory, setQuery }
}


