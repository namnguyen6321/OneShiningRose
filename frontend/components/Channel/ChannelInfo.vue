<template>
    <div class="flex items-center space-x-2">
        <Avatar :width="32" :height="32" />
        <div>
            <p class="text-white text-sm font-medium">{{ channel.name }}</p>
        </div>
        <button class="px-4 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-200">
            Đăng ký
        </button>
    </div>
</template>

<script setup>
import Avatar from '~/components/Avatar/Avatar.vue'

defineProps({
    channel: {
        type: Object,
        required: true,
        default: () => ({ name: '' })
    }
})
</script>

