<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  current: { type: Object, required: true },
  next: { type: Object, default: null },
  prev: { type: Object, default: null },
  externalDirection: { type: Number, default: 0 }
})
const emit = defineEmits(['slideEnd'])

const translateY = ref(0)
const isAnimating = ref(false)
const activeDirection = ref(0)
const containerHeight = ref(670) // Chiều cao container từ style của bạn

// Theo dõi externalDirection
watch(() => props.externalDirection, async (dir) => {
  if (dir !== 0 && !isAnimating.value) {
    activeDirection.value = dir
    await triggerSlide(dir)
  }
})

let startY = 0

const handleTouchStart = (e) => {
  if (isAnimating.value) return
  startY = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  if (isAnimating.value) return
  const deltaY = e.touches[0].clientY - startY
  translateY.value = Math.max(-containerHeight.value, Math.min(containerHeight.value, deltaY))
  
  if (Math.abs(deltaY) > 20) {
    activeDirection.value = deltaY > 0 ? -1 : 1
  }
}

const handleTouchEnd = (e) => {
  if (isAnimating.value) return
  const deltaY = e.changedTouches[0].clientY - startY
  const threshold = 80
  
  if (deltaY > threshold && props.prev) {
    activeDirection.value = -1
    triggerSlide(-1)
  } else if (deltaY < -threshold && props.next) {
    activeDirection.value = 1
    triggerSlide(1)
  } else {
    resetSlide()
  }
}

// FIX: Xử lý wheel event đúng cách
const handleWheel = (e) => {
  if (isAnimating.value) return
  e.preventDefault()
  
  if (e.deltaY > 30 && props.next) {
    activeDirection.value = 1
    triggerSlide(1)
  } else if (e.deltaY < -30 && props.prev) {
    activeDirection.value = -1
    triggerSlide(-1)
  }
}

async function triggerSlide(dir) {
  if (isAnimating.value) return
  isAnimating.value = true
  
  // Animation đến cuối
  translateY.value = dir * -containerHeight.value
  
  await new Promise(resolve => setTimeout(resolve, 400))
  
  emit('slideEnd', dir)
  resetSlide()
  isAnimating.value = false
  activeDirection.value = 0
}

function resetSlide() {
  translateY.value = 0
}

// FIX: Tính toán chính xác vị trí các video liền nhau
const currentVideoStyle = computed(() => {
  const currentHeight = 1 // 95% chiều cao
  const currentOffset = translateY.value * currentHeight
  
  return {
    transform: `translateY(${currentOffset}px)`,
    height: `${currentHeight * 100}%`,
    transition: isAnimating.value ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
    zIndex: 20
  }
})

const nextVideoStyle = computed(() => {
  if (!props.next) return { display: 'none' }
  
  const previewHeight = 0.01 // 5% preview
  const mainHeight = 0.95 // 95% main
  
  // Vị trí bắt đầu: ngay dưới video hiện tại
  const basePosition = containerHeight.value * mainHeight
  
  // FIX: Tính offset chính xác để 2 video liền nhau
  const offset = translateY.value * mainHeight
  
  // Chỉ hiện preview khi kéo lên (next)
  if (activeDirection.value !== 1 && translateY.value >= -50) {
    return { 
      display: 'none',
      zIndex: 10
    }
  }
  
  const opacity = Math.max(0.3, 1 - Math.abs(translateY.value) / containerHeight.value)
  
  return {
    display: 'block',
    transform: `translateY(${basePosition + offset}px)`,
    height: `${previewHeight * 100}%`,
    opacity: opacity,
    transition: isAnimating.value ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
    zIndex: 10
  }
})

const prevVideoStyle = computed(() => {
  if (!props.prev) return { display: 'none' }
  
  const previewHeight = 0.05 // 5% preview
  const mainHeight = 0.95 // 95% main
  
  // Vị trí bắt đầu: ngay trên video hiện tại
  const basePosition = -containerHeight.value * mainHeight
  
  // FIX: Tính offset chính xác
  const offset = translateY.value * mainHeight
  
  // Chỉ hiện preview khi kéo xuống (prev)
  if (activeDirection.value !== -1 && translateY.value <= 50) {
    return { 
      display: 'none',
      zIndex: 10 
    }
  }
  
  const opacity = Math.max(0.3, 1 - Math.abs(translateY.value) / containerHeight.value)
  
  return {
    display: 'block',
    transform: `translateY(${basePosition + offset}px)`,
    height: `${previewHeight * 100}%`,
    opacity: opacity,
    transition: isAnimating.value ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
    zIndex: 10
  }
})
</script>

<template>
  <div
    class="relative w-full max-w-[465px] h-full overflow-hidden bg-black rounded-md select-none"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @wheel="handleWheel" 
  >
    <!-- Video trước đó (preview trên cùng) -->
    <div v-if="prev" class="absolute top-0 left-0 right-0 overflow-hidden" :style="prevVideoStyle">
      <video
        :src="prev.url"
        class="w-full h-full object-cover"
        preload="auto"
        playsinline
      />
    </div>
    
    <!-- Video hiện tại -->
    <div class="absolute top-0 left-0 right-0 overflow-hidden" :style="currentVideoStyle">
      <video
        :src="current.url"
        class="w-full h-full object-cover"
        controls
        autoplay
        playsinline
      />
      <div class="absolute bottom-10 left-0 right-0  p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm font-semibold text-white">{{ current.channel }}</span>
          <span class="text-xs text-gray-300">{{ current.views }} lượt xem</span>
        </div>
        <p class="text-sm text-white line-clamp-2 leading-relaxed">{{ current.title }}</p>
      </div>
    </div>
    
    <!-- Video tiếp theo (preview dưới đáy) -->
    <div v-if="next" class="absolute bottom-0 left-0 right-0 overflow-hidden" :style="nextVideoStyle">
      <video
        :src="next.url"
        class="w-full h-full object-cover"
        preload="auto"
        playsinline
      />
    </div>
  </div>
</template>