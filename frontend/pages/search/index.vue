<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchVideos } from '~/api/video'
import VideoSearchList from '~/components/VideoSearchList.vue'
import AppHeader from '~/components/AppHeader.vue'
import AppSidebar from '~/components/AppSidebar.vue'
import Pagination from '~/components/Pagination.vue'

const route = useRoute()
const router = useRouter()
const videos = ref([])
const loading = ref(false)
const error = ref('')

const meta = ref({
  page: 1,
  totalPages: 1,
  total: 0
})
// Theo dõi tất cả query params từ cả Simple Search và Advanced Search
const searchParams = ref({ ...route.query })

let searchTimeout: NodeJS.Timeout

async function search() {
  console.log('🔍 [Search] Starting search with params:', searchParams.value)
  
  // Kiểm tra nếu có bất kỳ search param nào
  const hasSearchParams = Object.keys(searchParams.value).some(key => 
    searchParams.value[key] && searchParams.value[key] !== ''
  )
  
  if (!hasSearchParams) {
    console.log('❌ [Search] No search params, clearing videos')
    videos.value = []
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await fetchVideos(searchParams.value)
    console.log('✅ [Search] API Response:', res)
    
    videos.value = res.data || []
    // 👇 CẬP NHẬT META TỪ API
    meta.value = {
      page: res.meta?.page || 1,
      totalPages: res.meta?.totalPages || 1,
      total: res.meta?.total || 0
    }
    
  } catch (e: any) {
    console.error('❌ [Search] Error:', e)
    error.value = e?.message || e?.toString() || 'Lỗi tải video'
  } finally {
    loading.value = false
  }
}

// Watch tất cả query params thay đổi (cả từ Simple Search và Advanced Search)
watch(() => route.query, (newQuery) => {
  console.log('🔄 [Route Watch] Query changed:', newQuery)
  
  // Copy query params
  searchParams.value = { ...newQuery }
  
  // 👇 QUAN TRỌNG: Convert 'q' thành 'title' cho BE
  if (newQuery.q && !newQuery.title) {
    searchParams.value.title = newQuery.q
    delete searchParams.value.q
  }
  
  console.log('🔄 [Route Watch] Processed params:', searchParams.value)
  
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    search()
  }, 300)
}, { immediate: true, deep: true })

function onSearch(text: string) {
  console.log('👤 [User Search] User searched:', text)
  if (text && text.trim()) {
    // 👇 SIMPLE SEARCH: RESET HẾT FILTERS, CHỈ DÙNG TITLE
    router.push({ 
      path: '/search', 
      query: { 
        title: text.trim()  // Chỉ dùng title, reset các filter khác
      } 
    })
  }
}

function onPageChange(newPage: number) {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      page: newPage.toString()
    }
  })
}
// Hiển thị search summary để user biết đang filter gì
const searchSummary = computed(() => {
  const parts = []
  
  // Simple search (q)
  if (searchParams.value.q) parts.push(`"${searchParams.value.q}"`)
  
  // Advanced search filters
  if (searchParams.value.title) parts.push(`tiêu đề: "${searchParams.value.title}"`)
  if (searchParams.value.platform) parts.push(`nền tảng: ${searchParams.value.platform}`)
  if (searchParams.value.hashtag) parts.push(`hashtag: #${searchParams.value.hashtag}`)
  
  // Date range
  if (searchParams.value.from || searchParams.value.to) {
    const dateRange = [searchParams.value.from, searchParams.value.to].filter(Boolean).join(' - ')
    parts.push(`thời gian: ${dateRange}`)
  }
  
  return parts.length > 0 ? parts.join(', ') : null
})

// Debug info
const showDebugInfo = ref(false) 

const debugInfo = computed(() => {
  return {
    searchParams: searchParams.value,
    videosCount: videos.value.length,
    loading: loading.value,
    error: error.value,
    searchSummary: searchSummary.value
  }
})

onMounted(() => {
  console.log('🚀 [SearchPage] Component mounted')
  console.log('📊 [SearchPage] Initial route query:', route.query)
  console.log('🔧 [SearchPage] Debug info:', debugInfo.value)
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100 transition-colors duration-75">
    <AppHeader @search="onSearch" />
    <div class="flex">
      <AppSidebar class="min-h-screen h-auto" />
      <main class="flex-1">
        <div class="max-w-5xl mx-auto py-6 px-2">
          <h1 class="text-2xl font-bold mb-4">Kết quả tìm kiếm Video</h1>
          
          <div v-if="searchSummary" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              🔍 Đang tìm kiếm: <strong>{{ searchSummary }}</strong>
              <span v-if="meta.total > 0" class="ml-2 text-blue-600">
                ({{ meta.total }} kết quả)
              </span>
            </p>
          </div>
          
          <div v-if="!searchSummary" class="text-center py-10 text-gray-500">
            Nhập từ khoá để tìm kiếm video
          </div>
          
          <div v-else-if="loading" class="text-center py-10 text-gray-500">
            Đang tìm kiếm...
          </div>
          
          <div v-else-if="error" class="text-center py-10 text-red-500">
            {{ error }}
          </div>
          
          <div v-else-if="videos.length === 0" class="text-center py-10 text-gray-500">
            Không tìm thấy video phù hợp
          </div>
          
          <div v-else>
            <VideoSearchList :videos="videos" />
            
            <!-- 👇 THÊM PHÂN TRANG -->
            <div class="mt-8 flex flex-col items-center gap-4">
              <Pagination 
                :page="meta.page" 
                :total-pages="meta.totalPages"
                @update:page="onPageChange"
              />
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Trang {{ meta.page }} / {{ meta.totalPages }} • {{ meta.total }} kết quả
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>