<script setup>
import { ref, onMounted } from 'vue'

// Props
const props = defineProps({
    showShare: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['close'])

const currentUrl = ref('')

onMounted(() => {
    currentUrl.value = window.location.href
})

const closeModal = () => {
    emit('close')
}

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(currentUrl.value)
        // Có thể thêm toast notification
        alert('Đã sao chép liên kết!')
    } catch (err) {
        console.error('Failed to copy: ', err)
    }
}

const shareOptions = [
    {
        name: 'WhatsApp',
        icon: 'M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L1 23l6.71-1.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zM8.5 7.5c.28 0 .57.01.82.03.26.02.63-.1.98.75l.4 1.5c.04.15.01.32-.1.46l-.27.3c-.09.1-.18.25-.02.49.16.24.72 1.19 1.55 1.93.43.38.79.5.99.56.2.06.32.05.44-.03l.61-.48c.18-.14.43-.17.65-.06l1.48.7c.22.1.37.33.37.58 0 .5-.42 1.77-2.17 1.77-1.32 0-2.7-.54-3.79-1.54C7.87 12.5 6.5 10.23 6.5 8.5c0-.55.22-1 .55-1z',
        bgColor: 'bg-green-500',
        textColor: 'text-white'
    },
    {
        name: 'Facebook',
        icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
        bgColor: 'bg-blue-600',
        textColor: 'text-white'
    },
    {
        name: 'X',
        icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
        bgColor: 'bg-black',
        textColor: 'text-white'
    },
    {
        name: 'Gửi email',
        icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
        bgColor: 'bg-gray-600',
        textColor: 'text-white'
    },
    {
        name: 'KakaoTalk',
        icon: 'M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z',
        bgColor: 'bg-yellow-400',
        textColor: 'text-black'
    }
]

const shareToApp = (appName) => {
    const url = encodeURIComponent(currentUrl.value)
    const title = encodeURIComponent('Check out this video!')

    switch (appName) {
        case 'WhatsApp':
            window.open(`https://wa.me/?text=${url}`, '_blank')
            break
        case 'Facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
            break
        case 'X':
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
            break
        case 'Gửi email':
            window.open(`mailto:?subject=${title}&body=${url}`, '_blank')
            break
        case 'KakaoTalk':
            // KakaoTalk sharing would need SDK integration
            alert('KakaoTalk sharing requires SDK integration')
            break

    }
}
</script>

<template>
    <!-- Modal Backdrop -->
    <div v-if="showShare" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="closeModal">

        <!-- Modal Content -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">Chia sẻ</h2>
                <button @click="closeModal"
                    class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Share Options Grid -->
            <div class="grid grid-cols-5 gap-4 mb-6">
                <button v-for="option in shareOptions" :key="option.name" @click="shareToApp(option.name)"
                    class="flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                    <!-- Icon Circle -->
                    <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="option.bgColor">
                        <svg class="w-6 h-6" :class="option.textColor" fill="currentColor" viewBox="0 0 24 24">
                            <path :d="option.icon" />
                        </svg>
                    </div>
                    <!-- Label -->
                    <span class="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight">
                        {{ option.name }}
                    </span>
                </button>
            </div>

            <!-- URL Input with Copy Button -->
            <div class="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <input :value="currentUrl" readonly
                    class="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none" />
                <button @click="copyLink"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Sao chép
                </button>
            </div>
        </div>
    </div>
</template>