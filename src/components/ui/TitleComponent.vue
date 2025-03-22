<template>
  <component :is="`h${level}`" :class="computedClasses">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'

const props = defineProps<{
  level: 1 | 2
  className?: string
}>()

const computedClasses = computed(() => {
  const baseClass = 'font-bold'
  const levelClasses = {
    1: 'text-2xl font-black',
    2: 'text-sm md:text-base',
  }

  return `${baseClass} ${levelClasses[props.level]} ${props.className || ''}`
})
</script>
