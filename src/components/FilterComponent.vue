<script setup lang="ts">
import { useMapStore } from '@/store'

const store = useMapStore()
</script>

<template>
  <section>
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-bold">Filters</h2>
      <button
        v-if="!!store.filters.find((item) => item.isActive)"
        class="text-sm cursor-pointer"
        @click="store.resetFilters()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>

    <nav>
      <ul class="flex flex-row flex-wrap gap-4">
        <li v-for="filter in store.filters" :key="filter.type">
          <button
            @click="store.toggleFilter(filter.type)"
            :class="[
              'border rounded-sm py-1 px-2 text-sm cursor-pointer transition-all',
              filter.isActive ? 'bg-white text-slate-900' : 'bg-slate-900 text-white',
            ]"
          >
            {{ filter.type }}
          </button>
        </li>
      </ul>
    </nav>
  </section>
</template>
