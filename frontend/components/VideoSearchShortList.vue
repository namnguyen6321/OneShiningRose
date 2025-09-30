<template>
    <div class="grid gap-4 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                xl:grid-cols-5">
      <div 
        v-for="video in videos" 
        :key="video.id" 
        class="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition"
        @click="selectedVideo = video"
      >
        <img 
          :src="video.thumbnail" 
          alt="thumbnail" 
          class="w-full h-48 object-cover"
        />
        <div class="p-2 flex flex-col gap-1">
          <span class="font-medium text-sm line-clamp-2">{{ video.title }}</span>
          <span class="text-xs text-gray-400">{{ video.platform }}</span>
          <div class="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ formatViews(video.views) }} lượt xem</span>
            <span v-if="video.likes !== undefined">{{ formatLikes(video.likes) }} thích</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Dùng VideoOverlay -->
      <VideoOverlay 
        v-if="selectedVideo" 
        :show="true"
        :video="selectedVideo" 
        @close="selectedVideo = null" 
      />
  </template>
  
  <script setup lang="ts">
  import VideoOverlay from "./VideoOverlay.vue"
  const selectedVideo = ref<any>(null)
defineProps<{ videos: Array<{ id: string; title: string; views?: number|string; likes?: number|string; thumbnail?: string; platform?: string }> }>()

function formatViews(views: number|string|undefined) {
  if (!views) return '0';
  const v = typeof views === 'string' ? parseInt(views) : views;
  if (isNaN(v)) return '0';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return v.toString();
}
function formatLikes(likes: number|string|undefined) {
  if (!likes) return '0';
  const l = typeof likes === 'string' ? parseInt(likes) : likes;
  if (isNaN(l)) return '0';
  if (l >= 1_000_000) return (l / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (l >= 1_000) return (l / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return l.toString();
}
</script>

<style scoped>
.flex-1 {
  min-width: 0;
}
</style>
