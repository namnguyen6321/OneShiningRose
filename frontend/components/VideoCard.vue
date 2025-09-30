<script setup lang="ts">
type Video = {
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
  watched?: boolean
  likes?: string
}

import { ref ,} from 'vue'
import { markVideoAsWatched } from '~/api/crawler'

const props = defineProps<{ video: Video }>()
const watched = ref(props.video.watched || false)
const loading = ref(false)
const error = ref('')

async function handleMarkWatched() {
  loading.value = true
  error.value = ''
  try {
    await markVideoAsWatched(props.video.id)
    watched.value = true
  } catch (e: any) {
    error.value = e.message || 'Lỗi!'
  }
  loading.value = false
}

function formatViews(views: string | number | undefined) {
  const n = typeof views === 'string' ? parseInt(views) : (views || 0)
  if (n >= 1000000) return (Math.round(n / 100000) / 10) + 'M lượt xem'
  if (n >= 1000) return (Math.round(n / 100) / 10) + 'K lượt xem'
  return n + ' lượt xem'
}

function formatLikes(likes: string | number | undefined) {
  const n = typeof likes === 'string' ? parseInt(likes) : (likes || 0)
  if (n >= 1000000) return (Math.round(n / 100000) / 10) + 'M lượt thích'
  if (n >= 1000) return (Math.round(n / 100) / 10) + 'K lượt thích'
  return n + ' lượt thích'
}
</script>

<template>
  <article class="group cursor-pointer">
    <!-- Thumbnail -->
    <div class="relative w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden aspect-video">
      <img 
        :src="video.thumbnail" 
        :alt="video.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <!-- Duration badge -->
      <div class="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
        {{ video.duration }}
      </div>
    </div>

    <!-- Content -->
    <div class="mt-3 flex gap-3">
      <!-- Avatar -->
      <div class="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0">
        <img 
          :src="video.avatar" 
          :alt="video.platform || video.title"
          class="w-full h-full rounded-full object-cover"
        />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0 flex flex-col">
        <h3 class="font-medium text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 min-h-[40px]">
          {{ video.title }}
        </h3>
        <!-- <div class="flex items-center gap-2 mt-1 min-h-[20px]">
          <button
            v-if="!watched"
            @click.stop="handleMarkWatched"
            class="text-xs px-2 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            :disabled="loading"
          >
            Đánh dấu đã xem
          </button>
          <span v-else class="text-xs text-green-600">Đã xem</span>
          <span v-if="error" class="text-xs text-red-500 ml-2">{{ error }}</span>
        </div> -->
        <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-1 min-h-[18px]">
          <span>{{ video.platform || 'Không rõ kênh' }}</span>
          <span>•</span>
          <span>{{ formatViews(video.views) }}</span>
          <span>{{formatLikes(video.likes) }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

