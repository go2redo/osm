<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { FormKit } from '@formkit/vue'
import { useMapStore } from '@/store'
import type { FormData, Place } from '@/types'

const isOpen = ref(false)
const store = useMapStore()

const formData = ref<FormData>({
  name: '',
  type: store.filters.length ? store.filters[0].type : '',
  latitude: '',
  longitude: '',
})

function isValidLatitude(value: string): boolean {
  const num = parseFloat(value)
  return !isNaN(num) && num >= -90 && num <= 90
}

function isValidLongitude(value: string): boolean {
  const num = parseFloat(value)
  return !isNaN(num) && num >= -180 && num <= 180
}

const isFormValid = computed(() => {
  return (
    formData.value.name.trim().length > 0 &&
    formData.value.type.trim().length > 0 &&
    isValidLatitude(formData.value.latitude) &&
    isValidLongitude(formData.value.longitude)
  )
})

watch(
  () => store.filters,
  (filters) => {
    if (filters.length && !formData.value.type) {
      formData.value.type = filters[0].type
    }
  },
)

function handleSubmit(): void {
  if (!isFormValid.value) return

  const newPlace: Place = {
    id: Math.floor(Math.random() * 1000000),
    name: formData.value.name,
    type: formData.value.type,
    coordinates: [parseFloat(formData.value.longitude), parseFloat(formData.value.latitude)],
  }

  store.addNewPlace(newPlace)
  isOpen.value = false

  formData.value = {
    name: '',
    type: store.filters.length ? store.filters[0].type : '',
    latitude: '',
    longitude: '',
  }
}
</script>

<template>
  <section class="flex flex-col gap-2 md:gap-4">
    <div class="flex justify-between items-center">
      <h2 class="font-bold text-sm md:text-base">Add place</h2>
      <button class="bg-slate-900 text-white cursor-pointer" @click="isOpen = !isOpen">
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

    <div v-if="isOpen">
      <form @submit.prevent="handleSubmit">
        <div class="mb-2 md:mb-4 flex flex-col gap-1">
          <FormKit
            type="text"
            name="name"
            v-model="formData.name"
            placeholder="Enter name"
            validation="required"
            :classes="{
              outer: 'flex flex-col gap-1',
              input: 'w-full border rounded-sm py-1 px-2 text-xs md:text-sm focus:outline-none',
              message: 'text-red-500 text-xs px-2',
            }"
          />
        </div>

        <div class="mb-2 md:mb-4 flex flex-col gap-1">
          <FormKit
            type="select"
            name="type"
            v-model="formData.type"
            :options="store.filters.map((filter) => filter.type)"
            validation="required"
            :classes="{
              outer: 'flex flex-col gap-1',
              input:
                'w-full border rounded-sm py-1 px-2 text-xs md:text-sm focus:outline-none appearance-none',
              message: 'text-red-500 text-xs px-2',
            }"
          />
        </div>

        <div class="flex justify-between items-start mb-2 md:mb-4 gap-2 md:gap-4">
          <div class="w-1/2 flex flex-col gap-1">
            <FormKit
              type="text"
              name="latitude"
              v-model="formData.latitude"
              placeholder="Enter latitude"
              validation="required|number|between:-90,90"
              :classes="{
                outer: 'flex flex-col gap-1',
                input: 'w-full border rounded-sm py-1 px-2 text-xs md:text-sm focus:outline-none',
                message: 'text-red-500 text-xs px-2',
              }"
            />
          </div>
          <div class="w-1/2 flex flex-col gap-1">
            <FormKit
              type="text"
              name="longitude"
              v-model="formData.longitude"
              placeholder="Enter longitude"
              validation="required|number|between:-180,180"
              :classes="{
                outer: 'flex flex-col gap-1',
                input: 'w-full border rounded-sm py-1 px-2 text-xs md:text-sm focus:outline-none',
                message: 'text-red-500 text-xs px-2',
              }"
            />
          </div>
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            :disabled="!isFormValid"
            :class="[
              'text-slate-900 bg-white py-1 px-2 rounded-sm cursor-pointer border text-xs md:text-sm w-full font-bold',
              { 'opacity-80': !isFormValid },
            ]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
