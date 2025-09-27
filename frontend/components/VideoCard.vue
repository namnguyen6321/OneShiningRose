<script setup lang="ts">
type Video = {
  id: string
  title: string
  channel?: string
  views: string
  timeAgo: string
  thumbnail: string
  avatar: string
  duration: string
}

defineProps<{ video: Video }>()
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
          :alt="video.channel"
          class="w-full h-full rounded-full object-cover"
        />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-medium text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {{ video.title }}
        </h3>
        <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          {{ video.channel }}
        </p>
        <p class="text-xs text-neutral-600 dark:text-neutral-400">
          {{ video.views }} • {{ video.timeAgo }}
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
