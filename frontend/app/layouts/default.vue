<template>
  <UApp>
    <div class="flex flex-col h-screen">
      <!-- Header -->
      <AppHeader class="h-14" />

      <!-- Body: Sidebar + Content -->
      <div class="flex flex-1 overflow-hidden">
        <AppSidebar class="hidden md:block w-58 overflow-y-auto" />

        <main class="flex-1 p-4">
          <slot />
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup>
import AppHeader from '~/components/Header/AppHeader.vue'
import AppSidebar from '~/components/Sidebar/AppSidebar.vue'
</script>
