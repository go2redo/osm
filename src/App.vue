<script setup lang="ts">
import Sidebar from './components/SidebarComponent.vue'
import Map from './components/MapComponent.vue'
</script>

<template>
  <main class="h-full flex flex-row flex-wrap bg-slate-900 text-gray-200">
    <div class="h-full w-2/6">
      <Sidebar />
    </div>
    <div class="h-full w-4/6">
      <Map />
    </div>
  </main>
</template>
