<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import type { FeatureLike } from 'ol/Feature'
import { boundingExtent, getCenter } from 'ol/extent'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { highlightNearestUsers } from '@/geo/geoUtils'
import { fromLonLat } from 'ol/proj'
import { Point } from 'ol/geom'
import { findNearestUsers } from '@/geo/userSearch'
import { fetchPlaces } from '@/services'
import { initFilters } from '@/geo'
import { Feature, Map, type MapBrowserEvent, type View } from 'ol'
import { useMapStore } from '@/store'
import {
  createClusterStyle,
  createUserFeatures,
  createClusteredPlaceFeatures,
  filterPlaces,
} from '@/geo'

const MAX_ZOOM = 16

const store = useMapStore()
const mapRef = ref<{ map: Map }>()
const places = fetchPlaces()
const filteredPlaces = computed(() => filterPlaces(places, store.activeFilters))
const filteredAddedPlaces = computed(() => filterPlaces(store.addedPlaces, store.activeFilters))
const userSource = computed(() =>
  highlightNearestUsers(createUserFeatures(store.users), store.nearestUsers),
)
const clusteredPlaceSource = computed(() =>
  createClusteredPlaceFeatures(filteredPlaces.value, 50, store.zoomLevel),
)
const clusteredAddedPlaceSource = computed(() =>
  createClusteredPlaceFeatures(filteredAddedPlaces.value, 50, store.zoomLevel),
)

// watch for changes in the added places
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

// fetch users and set filters on mount
onMounted(async () => {
  await store.fetchUsers()
  store.setFilters(initFilters())
})

function handleClick(event: MapBrowserEvent<MouseEvent>): void {
  const map = event.map
  const view = map.getView()
  const feature = map.forEachFeatureAtPixel(event.pixel, (feat: FeatureLike) => feat)

  if (!feature) {
    return
  }

  const placeFeatures = feature.get('features') ?? [feature]

  // users have no type, so we can't select them
  if (!placeFeatures.some((place: FeatureLike) => place.get('type'))) return

  return placeFeatures.length > 1 ? zoomToCluster(view, feature) : selectPlace(placeFeatures[0])
}

// zoom to the cluster of places
function zoomToCluster(view: View, feature: FeatureLike): void {
  view.animate({
    center: getCenter(feature.getGeometry()!.getExtent()),
    zoom: Math.min((view.getZoom() ?? 0) + 2, MAX_ZOOM),
    duration: 500,
  })
}

// select a place and fit the view to contain the place and its nearest users
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

function handlePointerMove(event: MapBrowserEvent<MouseEvent>): void {
  const map = event.map

  // get the features at the pointer position
  const featuresToHover = collectHoveredFeatures(map, event.pixel)

  // reset the non-hovered features
  resetNonHoveredFeatures(map, featuresToHover)

  if (featuresToHover.size > 0) map.render()
}

function collectHoveredFeatures(map: Map, pixel: number[]): Set<FeatureLike> {
  const hoveredFeatures = new Set<FeatureLike>()

  map.forEachFeatureAtPixel(pixel, (feature: FeatureLike) => {
    if (feature instanceof Feature) {
      hoveredFeatures.add(feature)
      feature.set('isHovered', true)
    }
    return false
  })

  return hoveredFeatures
}

function resetNonHoveredFeatures(map: Map, hoveredFeatures: Set<FeatureLike>): void {
  map.getLayers().forEach((layer) => {
    if (layer instanceof VectorLayer) {
      const source = layer.getSource()
      if (source instanceof VectorSource) {
        source.getFeatures().forEach((feature) => {
          if (!hoveredFeatures.has(feature) && feature.get('isHovered')) {
            feature.set('isHovered', false)
          }
        })
      }
    }
  })
}
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
            (feature: Feature) => createClusterStyle(feature, store.selectedPlace?.id || null)
          "
        />
      </ol-vector-layer>

      <ol-vector-layer :source="clusteredAddedPlaceSource">
        <ol-style
          :overrideStyleFunction="
            (feature: Feature) => createClusterStyle(feature, store.selectedPlace?.id || null)
          "
        />
      </ol-vector-layer>

      <ol-vector-layer :source="userSource" />
    </ol-map>
  </section>
</template>
