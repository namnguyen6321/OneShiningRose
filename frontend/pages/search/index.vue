<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchVideos } from '~/api/video'
import VideoSearchList from '~/components/VideoSearchList.vue'
import AppHeader from '~/components/AppHeader.vue'
import AppSidebar from '~/components/AppSidebar.vue'

const route = useRoute()
const router = useRouter()
const videos = ref([])
const loading = ref(false)
const error = ref('')
const query = ref(route.query.q || '')

async function search() {
  if (!query.value) {
    videos.value = []
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await fetchVideos({ q: query.value })
    videos.value = res.data || []
  } catch (e: any) {
    error.value = e?.message || e?.toString() || 'Lỗi tải video'
  } finally {
    loading.value = false
  }
}

watch(() => route.query.q, (val) => {
  query.value = val || ''
  search()
}, { immediate: true })

function onSearch(text: string) {
  if (text && text.trim()) {
    router.push({ path: '/search', query: { q: text } })
  }
}
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100 transition-colors duration-75">
    <AppHeader @search="onSearch" />
    <div class="flex">
      <AppSidebar class="min-h-screen h-auto" />
      <main class="flex-1">
        <div class="max-w-5xl mx-auto py-6 px-2">
          <h1 class="text-2xl font-bold mb-4">Kết quả tìm kiếm Video</h1>
          <div v-if="!query" class="text-center py-10 text-gray-500">Nhập từ khoá để tìm kiếm video</div>
          <div v-else-if="loading" class="text-center py-10 text-gray-500">Đang tìm kiếm...</div>
          <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>
          <div v-else-if="videos.length === 0" class="text-center py-10 text-gray-500">Không tìm thấy video phù hợp</div>
          <VideoSearchList v-else :videos="videos" />
        </div>
      </main>
    </div>
  </div>
</template>
