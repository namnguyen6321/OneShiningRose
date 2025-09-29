<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
    showComments: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(["open-comments", "open-share"])

// Reactive state
const likeCount = ref(1300000) // 1.3 Tr
const commentCount = ref(4359)
const shareCount = ref(4300000) // 4.3 N
const isLiked = ref(false)
const isDisliked = ref(false)

// Methods
const toggleLike = () => {
    if (!isLiked.value) {
        isLiked.value = true
        isDisliked.value = false
    } else {
        isLiked.value = false
    }
    // Logic xử lý Like
}
const toggleDislike = () => {
    if (!isDisliked.value) {
        isDisliked.value = true
        isLiked.value = false
    } else {
        isDisliked.value = false
    }
    // Logic xử lý Dislike
}
const openComments = () => {
    emit("open-comments")
}
const shareVideo = () => {
    emit("open-share")
}

// Responsive logic chỉ chạy trên client
const isMobile = ref(false)

onMounted(() => {
    const handleResize = () => {
        isMobile.value = window.innerWidth < 768
    }
    handleResize() // Khởi tạo giá trị ban đầu
    window.addEventListener('resize', handleResize)

    // Dọn dẹp event listener khi component bị hủy
    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
    })
})
</script>

<template>
    <div class="absolute right-[-60px] bottom-10 flex flex-col items-center space-y-10 z-10 transition-transform duration-300"
        >
        <ActionButton icon="thumb-up" :count="likeCount" @click="toggleLike" :is-active="isLiked"
            aria-label="Thích video" />
        <ActionButton icon="thumb-down" count="Không" @click="toggleDislike" :is-active="isDisliked"
            aria-label="Không thích video" />
        <ActionButton icon="comment" :count="commentCount" @click="openComments" aria-label="Xem bình luận" />
        <ActionButton icon="share" :count="shareCount" @click="shareVideo" aria-label="Chia sẻ video" />
        <ActionButton icon="dots-vertical" aria-label="Thêm tùy chọn" />
        <Avatar :width="40" :height="40" :borderRadius="0" />
    </div>
</template>
