<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchVideos } from '~/api/video'

const videos = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetchVideos({})
    videos.value = res
  } catch (e: any) {
    error.value = e?.message || 'Lỗi tải video'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto py-6 px-2">
    <h1 class="text-2xl font-bold mb-4">Danh sách Video</h1>
    <div v-if="loading" class="text-center py-10 text-gray-500">Đang tải...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>
    <div v-else>
      <VideoGrid :videos="videos" />
    </div>
  </div>
</template>
