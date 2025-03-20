<script lang="ts" setup>
import { useMapStore } from '@/store'

const store = useMapStore()
</script>

<template>
  <section>
    <h2 class="font-bold">Info</h2>
    <div>
      <p>Name: {{ store.selectedPlace ? store.selectedPlace.name : '' }}</p>
      <p>Type: {{ store.selectedPlace ? store.selectedPlace.type : '' }}</p>
      <p>Coordinates: {{ store.selectedPlace ? store.selectedPlace.coordinates : '' }}</p>
    </div>
  </section>
</template>
