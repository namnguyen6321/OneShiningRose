<template>
    <aside class="h-full flex flex-col px-4 space-y-1">
        <SidebarLink v-for="item in menu" :key="item.to" :to="item.to" :label="item.label" :icon="item.icon" />
    </aside>
</template>

<script setup>
const menu = [
    { to: '/', label: 'Trang chủ', icon: { active: 'mdi:home', inactive: 'mdi:home-outline' } },
    { to: '/shorts', label: 'Shorts', icon: { active: 'mdi:motion-play', inactive: 'mdi:motion-play-outline' } },
]
</script>
