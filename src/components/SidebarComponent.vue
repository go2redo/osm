<script setup lang="ts">
import Filter from './FilterComponent.vue'
import Info from './InfoComponent.vue'
import Form from './FormComponent.vue'

import { useMapStore } from '@/store'

const store = useMapStore()
</script>

<template>
  <aside class="h-full p-8 shadow-2xl">
    <div class="flex flex-col gap-8">
      <div>
        <h1 class="font-black">OSM VUE 3</h1>
      </div>
      <div class="flex flex-col gap-8">
        <div>
          <Filter />
        </div>
        <hr />
        <template v-if="store.selectedPlace">
          <Info
            :id="store.selectedPlace.id"
            :name="store.selectedPlace.name"
            :type="store.selectedPlace.type"
            :coordinates="store.selectedPlace.coordinates"
            :nearestUsers="store.nearestUsers"
          />
          <hr />
        </template>
        <div>
          <Form />
        </div>
      </div>
    </div>
  </aside>
</template>
