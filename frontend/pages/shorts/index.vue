<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import VideoPlayer from '../components/Video/VideoPlayer.vue'
import ActionBar from '../components/Action/ActionBar.vue'
import CommentList from '../components/Comment/CommentList.vue'
import ModalShare from '../components/Modal/ModalShare.vue'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import { navigateTo } from '#app' // cần import

// Theme
const { isDark } = useTheme()

// Dữ liệu mock videos (fake data)
const videos = ref([
  { 
    id: 1, 
    title: 'This is what pure happiness looks like (hence our screaming 😂) #skydive #skydiving #crazy #fun', 
    thumbnail: 'https://picsum.photos/540/960?random=1', 
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    channel: 'Adventure Channel',
    views: '1.2M',
    likes: '45K'
  },
  { 
    id: 2, 
    title: 'Amazing cooking hack that will change your life! 🍳 #cooking #hack #lifehack', 
    thumbnail: 'https://picsum.photos/540/960?random=2', 
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    channel: 'Cooking Master',
    views: '890K',
    likes: '32K'
  },
  {
    id: 3,
    title: 'Relaxing nature sounds for better sleep 🌲🌊 #relax #nature #sleep',
    thumbnail: 'https://picsum.photos/540/960?random=3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    channel: 'Nature Relax',
    views: '2.3M',
    likes: '67K'
  },
  {
    id: 4,
    title: 'Funny cat compilation 🐱😂 #cat #funny #animals',
    thumbnail: 'https://picsum.photos/540/960?random=4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    channel: 'Cat Lovers',
    views: '3.1M',
    likes: '120K'
  },
  {
    id: 5,
    title: 'Extreme mountain biking POV 🚵‍♂️ #mountainbike #adventure',
    thumbnail: 'https://picsum.photos/540/960?random=5',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    channel: 'Bike World',
    views: '1.8M',
    likes: '54K'
  }
])

const currentIndex = ref(0)
const currentVideo = computed(() => videos.value[currentIndex.value] || null)
const nextVideoData = computed(() => {
  if (currentIndex.value < videos.value.length - 1) return videos.value[currentIndex.value + 1]
  return null
})
const prevVideoData = computed(() => {
  if (currentIndex.value > 0) return videos.value[currentIndex.value - 1]
  return null
})
const showComments = ref(false)
const showShare = ref(false)
const slideDirection = ref(0) // 1: next, -1: prev, 0: none

// Hàm trigger slide mới - đồng bộ với animation
const triggerSlide = (dir) => {
  if ((dir === 1 && currentIndex.value < videos.value.length - 1) || 
      (dir === -1 && currentIndex.value > 0)) {
    slideDirection.value = dir
  }
}

// Hàm xử lý khi slide kết thúc
const onSlideEnd = (dir) => {
  if (dir === 1 && currentIndex.value < videos.value.length - 1) {
    currentIndex.value++
  } else if (dir === -1 && currentIndex.value > 0) {
    currentIndex.value--
  }
  
  // Reset direction ngay sau khi animation kết thúc
  slideDirection.value = 0
  showComments.value = false
}



// Video navigation
const nextVideo = () => triggerSlide(1)
const prevVideo = () => triggerSlide(-1)

// Touch handling
let startY = 0
let startX = 0
let isScrolling = false

const handleTouchStart = (e) => {
  startY = e.touches[0].clientY
  startX = e.touches[0].clientX
  isScrolling = false
}

const handleTouchMove = (e) => {
  if (!isScrolling) {
    const deltaY = Math.abs(e.touches[0].clientY - startY)
    const deltaX = Math.abs(e.touches[0].clientX - startX)
    isScrolling = deltaX > deltaY
  }
}

const handleTouchEnd = (e) => {
  if (!isScrolling) {
    const deltaY = e.changedTouches[0].clientY - startY
    const threshold = 50
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Vuốt XUỐNG → video TRƯỚC (prev)
        triggerSlide(-1)
      } else {
        // Vuốt LÊN → video TIẾP THEO (next)  
        triggerSlide(1)
      }
    }
  }
}

// Keyboard navigation
const handleKeyDown = (e) => {
  switch(e.key) {
    case 'ArrowUp':
      e.preventDefault()
      nextVideo()
      break
    case 'ArrowDown':
      e.preventDefault()
      prevVideo()
      break
    case ' ':
      e.preventDefault()
      // Toggle play/pause nếu cần
      break
  }
}

// Comments and Share
const toggleComments = () => { showComments.value = !showComments.value }
const toggleShare = () => { showShare.value = !showShare.value }
const closeShare = () => { showShare.value = false }

// Handle search from header
const handleSearch = (searchQuery) => {
  if (searchQuery?.trim()) {
    navigateTo(`/?q=${encodeURIComponent(searchQuery)}`)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-neutral-900 dark:text-neutral-100">
    <AppHeader @search="handleSearch" />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 relative">
        <div class="flex justify-center relative overflow-hidden bg-white dark:bg-neutral-900" 
             style="height: 92vh;">
          <div 
            class="relative flex pt-4 items-center justify-center transition-transform duration-300 ease-in-out" 
            style="width: 455px; height: 670px;"
            :class="{ 'md:translate-x-[-220px]': showComments }"
          >
            <VideoPlayer
              :current="currentVideo"
              :next="nextVideoData"
              :prev="prevVideoData"
              :external-direction="slideDirection"
              class="w-full h-full rounded-md"
              @slideEnd="onSlideEnd"
            />
            <ActionBar :show-comments="showComments" @open-comments="toggleComments" @open-share="toggleShare" />
          </div>
          
          <!-- Navigation Controls -->
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20 transition-transform duration-300"
               :class="{ 'md:translate-x-[-320px]': showComments }">
            <button @click="() => triggerSlide(-1)" :disabled="currentIndex === 0" class="w-12 h-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center text-white transition-all disabled:opacity-30">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button @click="() => triggerSlide(1)" :disabled="currentIndex === videos.length - 1" class="w-12 h-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center text-white transition-all disabled:opacity-30">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div class="absolute top-4 right-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded-full">
            {{ currentIndex + 1 }} / {{ videos.length }}
          </div>
        </div>

        <!-- Comments Panel -->
        <div v-if="showComments" class="hidden md:flex absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-30">
          <div class="flex flex-col w-full">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bình luận</h3>
                <button @click="toggleComments" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto">
              <CommentList />
            </div>
          </div>
        </div>
      </main>
    </div>

    <ModalShare :showShare="showShare" @close="closeShare" />

    <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden z-10">
      <div class="bg-black bg-opacity-70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span>Vuốt lên/xuống để chuyển video</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </div>
</template>
