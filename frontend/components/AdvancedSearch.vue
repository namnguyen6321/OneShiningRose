<!-- components/AdvancedSearch.vue -->
<template>
  <div class="p-4 border-t border-neutral-200 dark:border-neutral-800">
    <h3 class="font-semibold text-sm mb-4 text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
      </svg>
      Tìm kiếm nâng cao
    </h3>
    
    <form @submit.prevent="applySearch" class="space-y-4">
      <!-- Platform Selection -->
      <div>
        <label class="block text-xs font-medium mb-2 text-neutral-600 dark:text-neutral-400">
          🎬 Nền tảng
        </label>
        <select 
          v-model="form.platform"
          class="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="facebook">Facebook</option>
          <option value="">Tất cả nền tảng</option>
        </select>
      </div>

      <!-- Title Selection -->
      <div>
        <label class="block text-xs font-medium mb-2 text-neutral-600 dark:text-neutral-400">
          📝 Tiêu đề
        </label>
        <input 
          v-model="form.title"
          type="text"
          placeholder="Tìm theo tiêu đề video..."
          class="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
      </div>

      <!-- Hashtags Selection -->
      <div>
        <label class="block text-xs font-medium mb-2 text-neutral-600 dark:text-neutral-400">
          🏷️ Hashtags
        </label>
        <input 
          v-model="form.hashtag"
          type="text"
          placeholder="music, funny, gaming..."
          class="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Nhập hashtag cụ thể, phân cách bằng dấu phẩy</p>
      </div>

      <!-- Date Range -->
      <div>
        <label class="block text-xs font-medium mb-2 text-neutral-600 dark:text-neutral-400">
          📅 Khoảng thời gian
        </label>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <input 
              v-model="form.startDate"
              type="date"
              class="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Từ ngày</p>
          </div>
          <div>
            <input 
              v-model="form.endDate"
              type="date"
              class="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Đến ngày</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <button 
          type="submit"
          class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Tìm kiếm
        </button>
        <button 
          type="button"
          @click="resetForm"
          class="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Reset
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const form = ref({
  platform: 'youtube',
  title: '',
  hashtag: '',
  startDate: '',
  endDate: ''
})

function applySearch() {
  const query: any = {}
  
  // Chỉ thêm các field có giá trị
  if (form.value.platform) query.platform = form.value.platform
  if (form.value.title) query.title = form.value.title
  if (form.value.hashtag) query.hashtag = form.value.hashtag
  if (form.value.startDate) query.from = form.value.startDate
  if (form.value.endDate) query.to = form.value.endDate

  console.log('🔍 [AdvancedSearch] Query:', query)
  
  // 👇 ADVANCED SEARCH: GIỮ NGUYÊN CÁC FILTERS
  router.push({
    path: '/search',
    query: query
  })
}

function resetForm() {
  form.value = {
    platform: 'youtube',
    title: '',
    hashtag: '',
    startDate: '',
    endDate: ''
  }
}
</script>