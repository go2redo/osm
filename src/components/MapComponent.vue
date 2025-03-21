<script setup lang="ts">
import { onMounted } from 'vue'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import { useMapStore } from '@/store'
import { createClusterStyle, createUserFeatures, createClusteredPlaceFeatures } from '@/geo'
import type { FeatureLike } from 'ol/Feature'
import type { MapBrowserEvent, View } from 'ol'
import { getCenter } from 'ol/extent'
import { usePlaces } from '@/composables'

const MAX_ZOOM = 16

const store = useMapStore()

const { filteredPlaces, filteredAddedPlaces } = usePlaces()

function handleClick(event: MapBrowserEvent<MouseEvent>): void {
  const { map } = event
  const view = map.getView()
  const feature = map.forEachFeatureAtPixel(event.pixel, (feat: FeatureLike) => feat)

  if (!feature) return store.setSelectedPlace(null)

  const placeFeatures = (feature.get('features') ?? [feature]) as FeatureLike[]

  return placeFeatures.length > 1 ? zoomToCluster(view, feature) : selectPlace(placeFeatures[0])
}

function zoomToCluster(view: View, feature: FeatureLike): void {
  view.animate({
    center: getCenter(feature.getGeometry()!.getExtent()),
    zoom: Math.min((view.getZoom() ?? 0) + 2, MAX_ZOOM),
    duration: 500,
  })
}

function selectPlace(place: FeatureLike): void {
  const placeCoords = place.get('coordinates')
  if (!placeCoords) return

  store.setSelectedPlace({
    id: Number(place.getId()),
    name: place.get('name'),
    type: place.get('type'),
    coordinates: placeCoords,
  })

  store.findNearestUsers(placeCoords)
}

onMounted(async () => {
  await store.fetchUsers()
})
</script>

<template>
  <section>
    <ol-map style="height: 100vh; width: 100vw" @click="handleClick">
      <ol-view :center="store.currentCenter" :zoom="store.zoomLevel" />
      <ol-tile-layer>
        <ol-source-xyz :url="'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'" />
      </ol-tile-layer>
      <ol-vector-layer
        :source="createClusteredPlaceFeatures(filteredPlaces)"
        :style="(feature: FeatureLike) => createClusterStyle(feature)"
      />
      <ol-vector-layer
        :source="createClusteredPlaceFeatures(filteredAddedPlaces)"
        :style="(feature: FeatureLike) => createClusterStyle(feature)"
      />
      <ol-vector-layer :source="createUserFeatures(store.users)" />
    </ol-map>
  </section>
</template>
