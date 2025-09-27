<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import AppSidebar from '~/components/AppSidebar.vue'

type ShortItem = { 
  id: string; title: string; thumbnail: string; views: string }

const shorts: ShortItem[] = Array.from({ length: 18 }).map((_, i) => ({
  id: String(i + 1),
  title: `Short #${i + 1} - Demo nội dung ngắn`,
  thumbnail: `https://picsum.photos/seed/short-${i}/540/960`, // 9:16
  views: `${(Math.random() * 900 + 100).toFixed(0)}K lượt xem`
}))
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
    <AppHeader />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1">
        <div class="px-4 py-4 mx-auto w-full max-w-[1280px]">
          <h1 class="text-xl font-semibold mb-4">Shorts (demo)</h1>
          <section class="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <article v-for="s in shorts" :key="s.id" class="group">
              <div class="w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden aspect-[9/16]">
                <img :src="s.thumbnail" alt="short" class="w-full h-full object-cover" />
              </div>
              <div class="mt-2">
                <p class="text-sm font-medium line-clamp-2">{{ s.title }}</p>
                <p class="text-xs text-neutral-600 dark:text-neutral-400">{{ s.views }}</p>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>



