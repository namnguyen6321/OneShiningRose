<script setup lang="ts">
import { ref, computed } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import FiltersBar from '../components/FiltersBar.vue'
import VideoGrid from '../components/VideoGrid.vue'
import Pagination from '../components/Pagination.vue'

// Dữ liệu mock cố định hiển thị ngay (chưa cần BE)
const allVideos = Array.from({ length: 40 }).map((_, i) => ({
  id: String(i + 1),
  title: `Tiêu đề video số ${i + 1} - Giao diện dạng YouTube`,
  channel: ['Kênh Demo', 'Tech Zone', 'Game TV', 'Tin Nhanh'][i % 4],
  views: `${(Math.random() * 900 + 100).toFixed(0)}K lượt xem`,
  timeAgo: `${(Math.random() * 11 + 1).toFixed(0)} ngày trước`,
  thumbnail: `https://picsum.photos/seed/thumb-${i}/640/360`,
  avatar: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
  duration: `${Math.floor(Math.random() * 9) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  category: ['Tất cả','Âm nhạc','Trò chơi','Tin tức','Trực tiếp','Bóng đá','Học tập','Phim','Du lịch','Công nghệ','Nấu ăn'][i % 11]
}))
// xử lý search
function normalizeText(str: string) {
  return str
    .normalize("NFD")                // tách ký tự + dấu
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/\s+/g, " ")            // chuẩn hoá khoảng trắng
    .trim()
    .toLowerCase()
}


// Trạng thái UI: tìm kiếm, danh mục, phân trang
const q = ref('')
const category = ref('Tất cả')
const page = ref(1)
const pageSize = ref(12)

const filtered = computed(() => {
  const text = normalizeText(q.value)
  const tokens = text.split(' ').filter(Boolean)
  return allVideos.filter(v => {
    const hay = normalizeText(`${v.title} ${v.channel}`)
    const matchText = tokens.length === 0 || tokens.every(t => hay.includes(t))
    const matchCat = category.value === 'Tất cả' || v.category === category.value
    return matchText && matchCat
  })
})



const total = computed(() => filtered.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})


const onSearch = (text: string) => { q.value = text; page.value = 1 }
const onCategory = (c: string) => { category.value = c; page.value = 1 }
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
    <AppHeader @search="onSearch" />

    <div class="flex">
      <AppSidebar />
      <main class="flex-1">
        <FiltersBar @change="onCategory" />

        <div class="mx-auto w-full max-w-[1280px]">
          <!-- Nếu có video thì render grid -->
          <VideoGrid v-if="paginated.length > 0" :videos="paginated" />

          <!-- Nếu không có video -->
          <div v-else class="p-10 text-center text-gray-500">
            Không có video phù hợp
          </div>
        </div>

        <!-- Chỉ hiển thị pagination khi có video -->
        <div v-if="paginated.length > 0" class="px-4 pb-8 flex items-center justify-center">
          <Pagination :page="page" :total-pages="totalPages" @update:page="(p) => page = p" />
        </div>
      </main>
    </div>
  </div>
</template>


<style scoped>
</style>

