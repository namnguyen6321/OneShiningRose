<template>
    <button
        class="relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        :class="{ 'bg-blue-100 text-blue-600': isActive }" @click="$emit('click')" :aria-label="ariaLabel">
        <Icon :name="icon" class="w-6 h-6" />
        <span v-if="count" class="absolute -bottom-5 text-xs text-gray-600 dark:text-gray-300">
            {{ formattedCount }}
        </span>
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    icon: { type: String, required: true },
    count: { type: [Number, String], default: null },
    isActive: { type: Boolean, default: false },
    ariaLabel: { type: String, required: true }
})

const formattedCount = computed(() => {
    if (typeof props.count === 'number') {
        return new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(props.count)
    }
    return props.count // Trường hợp "Không"
})

defineEmits(['click'])
</script>