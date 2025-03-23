<script setup lang="ts">
import { Filter, Info, Form } from '@/components'
import { Title } from '@/components/ui'
import { useMapStore } from '@/store'

const store = useMapStore()
</script>

<template>
  <aside class="h-full p-4 md:p-6 lg:p-8 shadow-2xl">
    <div class="flex flex-col gap-4 md:gap-6">
      <div class="hidden md:block">
        <Title :level="1" class="font-black">OSM VUE 3</Title>
      </div>
      <div class="flex flex-col gap-4 md:gap-6">
        <Filter
          :filters="store.filters"
          :toggleFilter="store.toggleFilter"
          :resetFilters="store.resetFilters"
        />
        <hr />
        <Form :filters="store.filters" :addNewPlace="store.addNewPlace" />
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
