<script setup lang="ts">
import Filter from './FilterComponent.vue'
import Info from './InfoComponent.vue'
import Form from './FormComponent.vue'

import { useMapStore } from '@/store'

const store = useMapStore()
</script>

<template>
  <aside class="h-full p-4 md:p-6 lg:p-8 shadow-2xl">
    <div class="flex flex-col gap-4 md:gap-6 lg:gap-8">
      <div>
        <h1 class="font-black">OSM VUE 3</h1>
      </div>
      <div class="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <Filter />
        <hr />
        <Form />
        <template v-if="store.selectedPlace">
          <hr />
          <Info
            :id="store.selectedPlace.id"
            :name="store.selectedPlace.name"
            :type="store.selectedPlace.type"
            :coordinates="store.selectedPlace.coordinates"
            :nearestUsers="store.nearestUsers"
          />
        </template>
      </div>
    </div>
  </aside>
</template>
