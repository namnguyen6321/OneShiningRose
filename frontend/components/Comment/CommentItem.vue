<script setup>
defineProps(['comment'])
</script>

<template>
    <div
        class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
        <!-- Avatar -->
        <Avatar />

        <!-- Nội dung -->
        <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ comment.user }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {{ comment.content }}
            </p>
            <span class="text-xs text-gray-400 dark:text-gray-500">
                {{ comment.time }}
            </span>
        </div>
    </div>
</template>

