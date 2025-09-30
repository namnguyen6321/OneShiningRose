<script setup lang="ts">
import { ref, watch, onMounted } from "vue"

const props = defineProps<{
  show: boolean
  video: any | null
}>()
const emit = defineEmits(["close"])

const youtubeUrl = ref("")

watch(() => props.video, (val) => {
  if (val?.thumbnail) {
    // Lấy videoId từ URL thumbnail
    const match = val.thumbnail.match(/vi\/([^/]+)\//)
    const videoId = match ? match[1] : ""
    youtubeUrl.value = videoId ? `https://www.youtube.com/watch?v=${videoId}` : ""
  }
}, { immediate: true })
</script>

<template>
  <div 
    v-if="show && video" 
    class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-neutral-900 rounded-xl max-w-3xl w-full overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 class="text-lg font-semibold line-clamp-1">{{ video.title }}</h2>
        <button @click="emit('close')" class="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-4 space-y-3">
        <!-- Embed video -->
        <div class="aspect-video w-full">
          <iframe
            v-if="youtubeUrl"
            :src="youtubeUrl.replace('watch?v=', 'embed/')"
            class="w-full h-full rounded-lg"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <!-- Info -->
        <div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ video.views?.toLocaleString() }} lượt xem • {{ video.likes?.toLocaleString() }} lượt thích
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span 
              v-for="tag in video.hashtags" 
              :key="tag" 
              class="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Action -->
        <a 
          v-if="youtubeUrl"
          :href="youtubeUrl" 
          target="_blank" 
          class="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Mở trên YouTube
        </a>
      </div>
    </div>
  </div>
</template>
