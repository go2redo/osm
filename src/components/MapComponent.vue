<script setup lang="ts">
import { onMounted } from 'vue'
import { Map, Layers, Sources } from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

import { useMapStore } from '@/store/useMapStore'
import { createUserFeatures } from '@/geo'

const cartoDarkUrl = 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const mapStore = useMapStore()

onMounted(async () => {
  await mapStore.fetchUsers()
})
</script>

<template>
  <section>
    <Map.OlMap style="height: 100vh; width: 100vw">
      <Map.OlView :center="mapStore.currentCenter" :zoom="mapStore.zoomLevel" />

      <!-- Dark Map -->
      <Layers.OlTileLayer>
        <Sources.OlSourceXyz :url="cartoDarkUrl" />
      </Layers.OlTileLayer>
      <!-- Dark Map -->

      <!-- Users -->
      <Layers.OlVectorLayer :source="createUserFeatures(mapStore.users)" />
      <!-- Users -->
    </Map.OlMap>
  </section>
</template>
