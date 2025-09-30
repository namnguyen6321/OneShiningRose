<script setup lang="ts">
import VideoCard from '../components/VideoCard.vue'

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
}

defineProps<{ videos: Video[] }>()
</script>

<template>
  <section class="grid gap-6 px-4 py-4"
    :class="'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'">
    <VideoCard v-for="v in videos" :key="v.id" :video="v" />
  </section>
</template>

<style scoped>
</style>





