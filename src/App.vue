<script setup lang="ts">
import Sidebar from './components/SidebarComponent.vue'
import Map from './components/MapComponent.vue'
</script>

<template>
  <main class="h-full flex flex-row flex-nowrap bg-slate-900 text-gray-200">
    <div class="w-full md:w-sm z-10 bg-slate-900 fixed bottom-0 left-0 md:static">
      <Sidebar />
    </div>
    <div class="w-full h-full md:flex-1">
      <Map />
    </div>
  </main>
</template>
