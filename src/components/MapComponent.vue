<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import { useMapStore } from '@/store'
import { createClusterStyle, createUserFeatures, createClusteredPlaceFeatures } from '@/geo'
import type { FeatureLike } from 'ol/Feature'
import { Feature, Map, type MapBrowserEvent, type View } from 'ol'
import { boundingExtent, getCenter } from 'ol/extent'
import { usePlaces } from '@/composables'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { highlightNearestUsers } from '@/geo/geoUtils'
import { fromLonLat } from 'ol/proj'
import { Point } from 'ol/geom'
import { findNearestUsers } from '@/geo/userSearch'

const MAX_ZOOM = 16

const store = useMapStore()

const mapRef = ref<{ map: Map }>()

const { filteredPlaces, filteredAddedPlaces } = usePlaces()

const userSource = computed(() =>
  highlightNearestUsers(createUserFeatures(store.users), store.nearestUsers),
)

const clusteredPlaceSource = computed(() =>
  createClusteredPlaceFeatures(filteredPlaces.value, 50, store.zoomLevel),
)

const clusteredAddedPlaceSource = computed(() =>
  createClusteredPlaceFeatures(filteredAddedPlaces.value, 50, store.zoomLevel),
)

function handlePointerMove(event: MapBrowserEvent<MouseEvent>): void {
  const map = event.map
  const featuresToHover: FeatureLike[] = []

  map.forEachFeatureAtPixel(event.pixel, (feature: FeatureLike) => {
    if (feature instanceof Feature) {
      featuresToHover.push(feature)
      feature.set('isHovered', true)
    }
    return false
  })

  map
    .getLayers()
    .getArray()
    .forEach((layer) => {
      if (layer instanceof VectorLayer) {
        const source = layer.getSource()
        if (source instanceof VectorSource) {
          source.getFeatures().forEach((feature: Feature) => {
            if (!featuresToHover.includes(feature) && feature.get('isHovered')) {
              feature.set('isHovered', false)
            }
          })
        }
      }
    })

  if (featuresToHover.length > 0) map.render()
}

function handleClick(event: MapBrowserEvent<MouseEvent>): void {
  const map = event.map
  const view = map.getView()
  const feature = map.forEachFeatureAtPixel(event.pixel, (feat: FeatureLike) => feat)

  if (!feature) {
    store.setSelectedPlace(null)
    store.resetNearestUsers()
    return
  }

  const placeFeatures = feature.get('features') ?? [feature]

  if (!placeFeatures.some((place: FeatureLike) => place.get('type'))) return

  return placeFeatures.length > 1 ? zoomToCluster(view, feature) : selectPlace(placeFeatures[0])
}

function zoomToCluster(view: View, feature: FeatureLike): void {
  view.animate({
    center: getCenter(feature.getGeometry()!.getExtent()),
    zoom: Math.min((view.getZoom() ?? 0) + 2, MAX_ZOOM),
    duration: 500,
  })
}

function selectPlace(place: Feature): void {
  const view = mapRef.value?.map.getView()

  if (!view) return

  const placeCoords = place.get('coordinates')

  if (!placeCoords) return

  const nearestUsers = findNearestUsers(placeCoords)
  const allCoords = [placeCoords, ...nearestUsers.map(({ user }) => user.coordinates)]
  const transformedCoords = allCoords.map((coord) => fromLonLat(coord))
  const extent = boundingExtent(transformedCoords)

  view.fit(extent, {
    padding: [100, 100, 100, 100],
    duration: 1000,
    maxZoom: MAX_ZOOM,
    callback: () => {
      store.setSelectedPlace({
        id: Number(place.getId()),
        name: place.get('name'),
        type: place.get('type'),
        coordinates: placeCoords,
      })
      store.setNearestUsers(nearestUsers)
    },
  })
}

watch(
  () => store.addedPlaces,
  (newAddedPlaces) => {
    const newPlace = newAddedPlaces[newAddedPlaces.length - 1]
    if (!newPlace || !mapRef.value) return

    const newFeature = new Feature({
      geometry: new Point(fromLonLat(newPlace.coordinates)),
      name: newPlace.name,
      type: newPlace.type,
      coordinates: newPlace.coordinates,
    })

    newFeature.setId(newPlace.id)
    selectPlace(newFeature)
  },
  { deep: true },
)

onMounted(async () => {
  await store.fetchUsers()
})
</script>

<template>
  <section class="h-full">
    <ol-map
      ref="mapRef"
      style="height: 100%; width: 100%"
      @click="handleClick"
      @pointermove="handlePointerMove"
    >
      <ol-view :center="store.currentCenter" :zoom="store.zoomLevel" />
      <ol-tile-layer>
        <ol-source-xyz url="https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      </ol-tile-layer>

      <ol-vector-layer :source="clusteredPlaceSource">
        <ol-style
          :overrideStyleFunction="
            (feature: FeatureLike) => createClusterStyle(feature, store.selectedPlace?.id || null)
          "
        />
      </ol-vector-layer>

      <ol-vector-layer :source="clusteredAddedPlaceSource">
        <ol-style
          :overrideStyleFunction="
            (feature: FeatureLike) => createClusterStyle(feature, store.selectedPlace?.id || null)
          "
        />
      </ol-vector-layer>

      <ol-vector-layer :source="userSource" />
    </ol-map>
  </section>
</template>
