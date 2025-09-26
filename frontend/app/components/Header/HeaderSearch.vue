<template>
    <div class="flex items-center w-full max-w-lg mx-4">
        <div class="relative flex-1">
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm"
                class="w-full pl-4 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition"
                aria-label="Tìm kiếm video" @focus="isFocused = true" @blur="isFocused = false"
                @keyup.enter="handleSearch" />
            <Icon name="mdi:magnify"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <button class="ml-2 p-2 bg-gray-100 flex items-center rounded-full transition"
            aria-label="Tìm kiếm bằng giọng nói" @click="handleVoiceSearch">
            <Icon name="mdi:microphone" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Define reactive variables
const searchQuery = ref('')
const isFocused = ref(false)

// Method to handle search (customize as needed)
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        console.log('Searching for:', searchQuery.value)
        // Add your search logic here (e.g., navigate or emit event)
    }
}

// Method to handle voice search (customize as needed)
const handleVoiceSearch = () => {
    console.log('Voice search triggered')
    // Add your voice search logic here
}
</script>
