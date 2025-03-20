<script setup lang="ts">
import Sidebar from './components/SidebarComponent.vue'
import Map from './components/MapComponent.vue'
</script>

<template>
  <main class="h-full flex flex-nowrap bg-slate-900 text-gray-200">
    <div class="h-full min-w-sm">
      <Sidebar />
    </div>
    <div class="h-full">
      <Map />
    </div>
  </main>
</template>
