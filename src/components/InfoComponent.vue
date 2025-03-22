<script lang="ts" setup>
import type { Place, User } from '@/types'

defineProps<
  Place & {
    nearestUsers: { distance: number; user: User }[]
  }
>()
</script>

<template>
  <section>
    <h2 class="font-bold mb-2 md:mb-4 text-sm md:text-base">Detailed info</h2>
    <div class="mb-4">
      <ul class="text-xs md:text-sm">
        <li>Name: {{ name }}</li>
        <li>Type: {{ type }}</li>
        <li>Coordinates: {{ coordinates }}</li>
      </ul>
    </div>
    <h2 class="font-bold mb-2 md:mb-4 text-sm md:text-base">Nearest Users</h2>
    <div>
      <ul class="text-xs md:text-sm">
        <li v-for="user in nearestUsers" :key="user.user.id">
          {{ user.user.name }} - {{ user.distance.toFixed(2) }} km
        </li>
      </ul>
    </div>
  </section>
</template>
