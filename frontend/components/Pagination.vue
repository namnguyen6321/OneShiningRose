<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; totalPages: number }>()
const emit = defineEmits<{ (e: 'update:page', value: number): void }>()

const canPrev = computed(() => props.page > 1)
const canNext = computed(() => props.page < props.totalPages)

const go = (p: number) => {
  if (p < 1 || p > props.totalPages || p === props.page) return
  emit('update:page', p)
}

// Tạo danh sách các trang hiển thị: 1, 2, ..., n với hiện 2 bên cạnh current
const items = computed(() => {
  const total = props.totalPages
  const current = props.page
  const result: Array<{ type: 'page' | 'ellipsis'; value?: number }> = []

  const addPage = (p: number) => result.push({ type: 'page', value: p })
  const addEllipsis = () => result.push({ type: 'ellipsis' })

  const window: number[] = []
  for (let p = Math.max(1, current - 1); p <= Math.min(total, current + 1); p++) window.push(p)

  const set = new Set<number>([1, 2, ...window, total - 1, total].filter(p => p >= 1 && p <= total))
  const list = Array.from(set).sort((a, b) => a - b)

  for (let i = 0; i < list.length; i++) {
    const p = list[i]
    if (typeof p !== 'number') continue
    addPage(p)
    const next = list[i + 1]
    if (i < list.length - 1 && typeof next === 'number' && next - p > 1) addEllipsis()
  }
  return result
})
</script>

<template>
  <nav class="flex items-center justify-center gap-2 select-none">
    <button
      class="h-8 w-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 grid place-items-center shadow-sm disabled:opacity-50"
      :disabled="!canPrev"
      @click="go(page - 1)"
      aria-label="Previous"
    >
      «
    </button>

    <template v-for="(it, idx) in items" :key="idx">
      <button
        v-if="it.type === 'page'"
        class="min-w-8 h-8 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
        :class="it.value === page ? 'ring-1 ring-neutral-400 dark:ring-neutral-600 font-medium' : ''"
        @click="go(it.value as number)"
      >
        {{ it.value }}
      </button>
      <span v-else class="px-2 text-neutral-500">…</span>
    </template>

    <button
      class="h-8 w-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 grid place-items-center shadow-sm disabled:opacity-50"
      :disabled="!canNext"
      @click="go(page + 1)"
      aria-label="Next"
    >
      »
    </button>
  </nav>
</template>

<style scoped>
</style>



