<script setup>
import { ref } from 'vue'
// Dữ liệu mock (thay bằng API sau)
const videos = ref([
    { id: 1, title: 'This is what pure happiness looks like (hence our screaming 😂) #skydive #skydiving #crazy #fun', thumbnail: '/placeholder.jpg', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 2, title: 'This is what pure happiness looks like (hence our screaming 😂) #skydive #skydiving #crazy #fun', thumbnail: '/placeholder.jpg', url: 'https://www.w3schools.com/html/movie.mp4' },
])
const activeVideo = ref(videos.value[0])

const showComments = ref(false)
const showShare = ref(false)
const toggleComments = () => {
    showComments.value = !showComments.value
}
const toggleShare = () => {
    showShare.value = !showShare.value
}
const closeShare = () => {
    showShare.value = false
}
</script>

<template>
    <div class="flex items-start justify-center h-screen bg-white dark:bg-black">
        <div class="flex w-full max-w-6xl gap-6 transition-all duration-300"
            :class="showComments ? 'md:grid md:grid-cols-2' : 'flex justify-center'">
            <!-- Video (center, fixed mobile size) -->
            <div class="relative flex items-center justify-center" style="width: 365px; height: 645px;">
                <VideoPlayer :video="activeVideo" class="w-full h-full rounded-md" />
                <!-- Actions Column (absolute, right of video) -->
                <ActionBar @open-comments="toggleComments" @open-share="toggleShare" />
            </div>
            <!-- Comments Panel -->
            <div v-if="showComments" class="hidden md:flex flex-col bg-gray-50 dark:bg-gray-900 rounded-md shadow p-4">
                <CommentList />
            </div>
        </div>
        <!-- Modal Share -->
        <ModalShare :showShare="showShare" @close="closeShare" />
    </div>
</template>