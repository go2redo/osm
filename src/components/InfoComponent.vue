<script lang="ts" setup>
import type { Place } from '@/types'

defineProps<Place>()
</script>

<template>
  <section>
    <h2 class="font-bold mb-1">Info</h2>
    <div>
      <p>Name: {{ name }}</p>
      <p>Type: {{ type }}</p>
      <p>Coordinates: {{ coordinates }}</p>
    </div>
  </section>
</template>
