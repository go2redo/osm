<script setup lang="ts">
import { ref } from 'vue'
import { IconName } from '@/types'
import { Badge, Icon, Title } from '@/components/ui'

defineProps<{
  filters: { type: string; isActive: boolean }[]
  toggleFilter: (type: string) => void
  resetFilters: () => void
}>()

const isOpen = ref(true)
</script>

<template>
  <section class="flex flex-col gap-2 md:gap-4">
    <div class="flex justify-between items-center">
      <Title :level="2" class="font-bold text-sm md:text-base">Filters</Title>
      <div class="flex gap-1">
        <button
          v-if="!!filters.find((item) => item.isActive)"
          class="flex items-center gap-1 text-sm cursor-pointer"
          @click="resetFilters()"
        >
          Clear all
          <Icon :name="IconName.CLOSE" class="size-4 md:size-6" />
        </button>
        <button class="text-sm cursor-pointer" @click="isOpen = !isOpen">
          <Icon :name="isOpen ? IconName.MINUS : IconName.ADD" class="size-4 md:size-6" />
        </button>
      </div>
    </div>
    <nav v-show="isOpen">
      <ul class="flex flex-row flex-wrap gap-1 md:gap-2">
        <li v-for="filter in filters" :key="filter.type">
          <Badge
            :label="filter.type"
            :isActive="filter.isActive"
            @click="toggleFilter(filter.type)"
          />
        </li>
      </ul>
    </nav>
  </section>
</template>
