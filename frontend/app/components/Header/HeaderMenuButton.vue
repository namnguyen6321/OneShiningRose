<script setup>
const emit = defineEmits(['toggle-sidebar'])
</script>

<template>
    <button class="p-2 ml-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        aria-label="Mở menu" @click="emit('toggle-sidebar')">
        <Icon name="mdi:menu" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
    </button>
</template>