<script setup lang="ts">
import { onMounted } from 'vue'
import { Map, Layers, Sources } from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import { useMapStore } from '@/store'
import { createClusterStyle, createUserFeatures, createClusteredPlaceFeatures } from '@/geo'
import placesData from '../data/places.json'

const mapStore = useMapStore()

onMounted(async () => {
  await mapStore.fetchUsers()
})
</script>

<template>
  <section>
    <Map.OlMap style="height: 100vh; width: 100vw">
      <Map.OlView :center="mapStore.currentCenter" :zoom="mapStore.zoomLevel" />
      <Layers.OlTileLayer>
        <Sources.OlSourceXyz
          :url="'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'"
        />
      </Layers.OlTileLayer>
      <Layers.OlVectorLayer
        :source="createClusteredPlaceFeatures(placesData)"
        :style="(feature) => createClusterStyle(feature)"
      />
      <Layers.OlVectorLayer :source="createUserFeatures(mapStore.users)" />
    </Map.OlMap>
  </section>
</template>
