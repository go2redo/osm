<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  label: string
  isActive: boolean
  className?: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    @click="$emit('click')"
    :class="[
      'border rounded-sm py-0.5 md:py-1 px-2 text-xs md:text-sm cursor-pointer transition-all',
      isActive ? 'bg-white text-slate-900' : 'bg-slate-900 text-white',
      className,
    ]"
  >
    {{ label }}
  </button>
</template>
