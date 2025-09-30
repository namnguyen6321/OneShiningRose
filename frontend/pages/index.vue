<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import FiltersBar from '../components/FiltersBar.vue'
import VideoGrid from '../components/VideoGrid.vue'
import Pagination from '../components/Pagination.vue'

import { useVideos } from '../composables/useVideos'
import { useRouter } from 'vue-router'

const { videos, loading, error, page, limit, setPage, setQuery, fetchAll, total } = useVideos()
const router = useRouter()

const onSearch = (text: string) => {
  if (text && text.trim()) {
    router.push({ path: '/search', query: { q: text } })
  }
}
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100 
  transition-colors duration-75">
    <AppHeader @search="onSearch" />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1">
        <FiltersBar />
        <div class="mx-auto w-full max-w-[1280px] px-4">
          <div v-if="loading" class="p-10 text-center text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
          <div v-else-if="error" class="p-10 text-center text-red-500">{{ error }}</div>
          <VideoGrid v-else-if="videos.length > 0" :videos="videos" />
          <div v-else class="p-10 text-center text-gray-500 dark:text-gray-400">Không có video phù hợp</div>
          <Pagination
            v-if="!loading && !error && videos.length > 0 && total > limit"
            :page="page"
            :total-pages="Math.ceil(total / limit)"
            @update:page="setPage"
            class="mt-8"
          />
        </div>
        <!-- Có thể bổ sung phân trang ở đây nếu backend trả về total/limit/page -->
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Các style custom của bạn vẫn giữ nguyên */
</style>