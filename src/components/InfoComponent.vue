<script lang="ts" setup>
import type { Place, User } from '@/types'
import { Title } from '@/components/ui'

defineProps<
  Place & {
    nearestUsers: { distance: number; user: User }[]
  }
>()
</script>

<template>
  <section>
    <Title :level="2" class="font-bold mb-2 md:mb-4 text-sm md:text-base">Detailed info</Title>
    <div class="mb-4">
      <ul class="text-xs md:text-sm">
        <li>ID: {{ id }}</li>
        <li>Name: {{ name }}</li>
        <li>Type: {{ type }}</li>
        <li>Coordinates: {{ coordinates }}</li>
      </ul>
    </div>
    <Title :level="2" class="font-bold mb-2 md:mb-4 text-sm md:text-base">Nearest Users</Title>
    <div>
      <ul class="text-xs md:text-sm">
        <li v-for="user in nearestUsers" :key="user.user.id">
          {{ user.user.name }} - {{ user.distance.toFixed(2) }} km
        </li>
      </ul>
    </div>
  </section>
</template>
