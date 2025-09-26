<template>
    <NuxtLink :to="to"
        class="flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-500" :class="isActive
            ? 'bg-gray-150 font-bold text-black dark:bg-gray-500 dark:text-white'
            : 'bg-white text-black dark:bg-gray-600 dark:text-gray-200'">
        <Icon :name="currentIcon" class="w-7 h-7" />
        <span class="ml-4">{{ label }}</span>
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    to: { type: String, required: true },
    icon: { type: Object, required: true },
    label: { type: String, required: true }
})

const route = useRoute()
const isActive = computed(() => route.path === props.to)
const currentIcon = computed(() => isActive.value ? props.icon.active : props.icon.inactive)
</script>