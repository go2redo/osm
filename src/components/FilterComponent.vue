<script setup lang="ts">
import { useMapStore } from '@/store'
import { ref } from 'vue'

const isOpen = ref(true)

const store = useMapStore()
</script>

<template>
  <section class="flex flex-col gap-2 md:gap-4">
    <div class="flex justify-between items-center">
      <h2 class="font-bold text-sm md:text-base">Filters</h2>
      <div class="flex gap-1">
        <button
          v-if="!!store.filters.find((item) => item.isActive)"
          class="flex items-center gap-1 text-sm cursor-pointer"
          @click="store.resetFilters()"
        >
          Clear all
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4 md:size-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button class="text-sm cursor-pointer" @click="isOpen = !isOpen">
          <svg
            v-if="isOpen"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4 md:size-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4 md:size-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    <nav v-show="isOpen">
      <ul class="flex flex-row flex-wrap gap-1 md:gap-2">
        <li v-for="filter in store.filters" :key="filter.type">
          <button
            @click="store.toggleFilter(filter.type)"
            :class="[
              'border rounded-sm py-0.5 md:py-1 px-2 text-xs md:text-sm cursor-pointer transition-all',
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
