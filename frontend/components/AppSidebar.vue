<script setup lang="ts">
const items = [
  { label: 'Trang chủ', icon: 'home', to: '/' },
  { label: 'Shorts', icon: 'play', to: '/shorts' },
  { label: 'Kênh đăng ký', icon: 'bookmark', to: '#' },
  { label: 'Thư viện', icon: 'library', to: '#' }
]

function pathFor(icon: string) {
  switch (icon) {
    case 'home': return 'M3 12l9-9 9 9M5 10v10h14V10'
    case 'play': return 'M8 5v14l11-7-11-7z'
    case 'bookmark': return 'M6 4h12v16l-6-4-6 4V4z'
    case 'library': return 'M4 6h12v12H4zM18 8v10'
    default: return 'M3 12h18'
  }
}
</script>

<template>
  <aside class="hidden md:block w-60 shrink-0 border-r border-neutral-200
   dark:border-neutral-800 bg-white dark:bg-neutral-900">
    <nav class="p-2">
      <ul class="space-y-1">
        <li v-for="item in items" :key="item.label">
          <NuxtLink :to="item.to" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path :d="pathFor(item.icon)" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text-sm">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
</style>




