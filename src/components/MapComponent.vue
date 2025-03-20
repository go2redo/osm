<script setup lang="ts">
import { onMounted } from 'vue'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import { useMapStore } from '@/store'
import { createClusterStyle, createUserFeatures, createClusteredPlaceFeatures } from '@/geo'
import type { FeatureLike } from 'ol/Feature'
import type { MapBrowserEvent } from 'ol'

import placesData from '../data/places.json'

const mapStore = useMapStore()

function handleClick(event: MapBrowserEvent<MouseEvent>): void {
  const map = event.map
  const feature = map.forEachFeatureAtPixel(event.pixel, (feat: FeatureLike) => feat)

  if (feature) {
    const placeFeature = feature.get('features') ? feature.get('features')[0] : feature

    mapStore.setSelectedPlace({
      id: placeFeature.getId(),
      name: placeFeature.get('name'),
      type: placeFeature.get('type'),
      coordinates: placeFeature.get('coordinates'),
    })
  } else {
    mapStore.setSelectedPlace(null)
  }
}

onMounted(async () => {
  await mapStore.fetchUsers()
})
</script>

<template>
  <section>
    <ol-map style="height: 100vh; width: 100vw" @click="handleClick">
      <ol-view :center="mapStore.currentCenter" :zoom="mapStore.zoomLevel" />
      <ol-tile-layer>
        <ol-source-xyz :url="'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'" />
      </ol-tile-layer>
      <ol-vector-layer
        :source="createClusteredPlaceFeatures(placesData)"
        :style="(feature: FeatureLike) => createClusterStyle(feature)"
      />
      <ol-vector-layer :source="createUserFeatures(mapStore.users)" />
    </ol-map>
  </section>
</template>
