<template>
    <div class="relative h-full w-full bg-black overflow-hidden rounded-lg" @click="togglePlay"
        @keydown.space.prevent="togglePlay" tabindex="0" aria-label="Video player">
        <!-- Video Element -->
        <video ref="videoEl" :src="video.url" class="h-full w-auto object-contain" muted loop preload="none"></video>
        <!-- Play/Pause Overlay (hiển thị dựa trên trạng thái) -->
        <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-20" :class="{
            'opacity-100': !isPlaying, // Luôn hiển thị khi dừng
            'opacity-0 hover:opacity-100': isPlaying // Ẩn khi chạy, hiển thị khi hover
        }">
            <button
                class="flex items-center justify-center w-16 h-16 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-all duration-200"
                @click.stop="togglePlay" aria-label="Chơi hoặc Dừng video">
                <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-8 h-8 text-white" />
            </button>
        </div>
        <!-- Channel Info and Title Overlay -->
        <div class="absolute bottom-0 left-0 p-4 w-full flex flex-col space-y-2">
            <ChannelInfo :channel="{ name: 'NguyenVanHieu' }" />
            <p class="text-white">{{ video.title }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

defineProps({
    video: { type: Object, required: true }
})

const isPlaying = ref(false)
const videoEl = ref(null)

// Hàm xử lý resize để tái sử dụng
const handlePlayState = () => {
    if (videoEl.value) {
        isPlaying.value = !videoEl.value.paused
    }
}

onMounted(() => {
    if (process.client) {
        nextTick(() => {
            if (videoEl.value) {
                // Đảm bảo muted từ đầu để autoplay hoạt động
                videoEl.value.muted = true
                videoEl.value.play().catch((err) => {
                    console.warn('Autoplay failed:', err)
                })
                isPlaying.value = !videoEl.value.paused // Cập nhật trạng thái ban đầu

                // Gắn event listener
                videoEl.value.addEventListener('play', handlePlayState)
                videoEl.value.addEventListener('pause', handlePlayState)
            }
        })
    }
})

onUnmounted(() => {
    if (process.client && videoEl.value) {
        videoEl.value.pause()
        videoEl.value.removeEventListener('play', handlePlayState)
        videoEl.value.removeEventListener('pause', handlePlayState)
    }
})

const togglePlay = () => {
    if (process.client && videoEl.value) {
        if (isPlaying.value) {
            videoEl.value.pause()
        } else {
            videoEl.value.play().catch(() => {
                videoEl.value.muted = true
                videoEl.value.play()
            })
        }
        handlePlayState() // Cập nhật trạng thái sau khi toggle
    }
}
</script>