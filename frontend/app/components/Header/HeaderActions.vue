<template>
    <div class="flex items-center">
        <button class="p-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Icon name="mdi:upload" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <button class="p-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Icon name="mdi:bell-outline" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <button v-if="isLoggedIn" class="flex items-center rounded-full ml-2">
            <Avatar :width="28" :height="28" />
        </button>
        <button v-else
            class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
            Đăng nhập
        </button>
    </div>
</template>

<script setup>
const isLoggedIn = ref(true)
</script>
