<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const query = ref('')
const emit = defineEmits<{ (e: 'search', value: string): void }>()
const onSubmit = () => emit('search', query.value)

const { isDark, toggle } = useTheme()

function reloadHome(e?: Event) {
  window.location.href = '/'
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
    <div class="flex items-center gap-4 px-4 h-[56px]">
      <div class="flex items-center gap-2 min-w-[64px]">
        <!-- YouTube Logo SVG -->
        <a href="/" @click.prevent="reloadHome" class="flex items-center gap-1 group select-none cursor-pointer">
          <svg class="w-8 h-6" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="90" height="60" rx="12" fill="#FF0000"/>
            <polygon points="36,18 66,30 36,42" fill="#fff"/>
          </svg>
          <span class="font-semibold text-lg text-red-600 group-hover:opacity-80 dark:text-white">YouTube</span>
        </a>
      </div>

      <form class="flex-1 flex items-center" @submit.prevent="onSubmit">
        <div class="flex w-full max-w-3xl mx-auto">
          <input 
            v-model="query" 
            type="search" 
            placeholder="Tìm kiếm" 
            class="flex-1 h-10 px-4 border border-neutral-300 dark:border-neutral-700 rounded-l-full bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @keydown.space.stop
            @keydown.enter.prevent="onSubmit"
          />
          <button type="submit" class="h-10 px-4 border border-l-0 border-neutral-300 dark:border-neutral-700 rounded-r-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="Tìm kiếm">
            <!-- Magnifier -->
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="6"/><path stroke-linecap="round" d="m20 20-3.5-3.5"/></svg>
          </button>
        </div>
      </form>

      <div class="flex items-center gap-2">
        <button class="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Chuyển giao diện" @click="toggle()">
          <!-- Sun / Moon -->
          <client-only>
            <svg v-if="!isDark" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
          </client-only>
        </button>
        <button class="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Tải lên">
          <!-- Arrow Up Tray -->
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0 4 4m-4-4-4 4M4 20h16"/></svg>
        </button>
        <button class="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Thông báo">
          <!-- Bell -->
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 8a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7"/><path stroke-linecap="round" d="M10 20a2 2 0 0 0 4 0"/></svg>
        </button>
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>




