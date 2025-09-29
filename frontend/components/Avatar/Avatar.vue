<template>
    <div :style="{ width: width + 'px', height: height + 'px', borderRadius: borderRadius + 'px' }"
        class="overflow-hidden">
        <img src="~/assets/img/user-avatar.jpg" :alt="alt" :width="width" :height="height" class=" object-cover" />
    </div>
</template>

<script setup>
const props = defineProps({
    width: { type: Number, default: 32 },
    height: { type: Number, default: 32 },
    borderRadius: { type: Number, default: 50 },
    src: { type: String, default: '~/assets/img/user-avatar.jpg' },
    alt: { type: String, default: 'User Avatar' }
})
</script>

