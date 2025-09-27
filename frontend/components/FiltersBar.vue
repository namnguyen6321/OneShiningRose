<script setup lang="ts">
import { ref } from 'vue'

const categories = [
  'Tất cả', 'Âm nhạc', 'Trò chơi', 'Tin tức', 'Trực tiếp', 'Bóng đá', 'Học tập', 'Phim', 'Du lịch', 'Công nghệ', 'Nấu ăn'
]

const selected = ref('Tất cả')
const emit = defineEmits<{ (e: 'change', value: string): void }>()
const select = (c: string) => { selected.value = c; emit('change', c) }
</script>

<template>
  <div class="sticky top-[56px] z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
    <div class="flex gap-3 overflow-x-auto no-scrollbar px-4 py-3">
      <button
        v-for="c in categories"
        :key="c"
        @click="select(c)"
        class="px-3 py-1.5 rounded-full whitespace-nowrap text-sm border"
        :class="selected === c ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'"
      >
        {{ c }}
      </button>
    </div>
  </div>
  
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


