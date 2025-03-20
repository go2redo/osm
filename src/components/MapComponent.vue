<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Map, Layers, Sources } from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import { Feature } from 'ol'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'
import { type User } from '../types'
import { fetchUsers } from '../services'

const cartoDarkUrl = 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const usersVectorSource = new VectorSource()
const users = ref<User[]>([])

const createEmojiStyle = () =>
  new Style({
    text: new Text({
      text: '👽',
      font: '24px sans-serif',
    }),
  })

const initializeUsers = async () => {
  users.value = await fetchUsers()

  users.value.forEach((user) => {
    const coords = [parseFloat(user.address.geo.lng), parseFloat(user.address.geo.lat)]
    const feature = new Feature({
      geometry: new Point(fromLonLat(coords)),
      name: user.name,
      coordinates: coords,
    })
    feature.setStyle(createEmojiStyle())
    usersVectorSource.addFeature(feature)
  })
}

onMounted(() => {
  initializeUsers()
})
</script>

<template>
  <section>
    <Map.OlMap style="height: 100vh; width: 100vw">
      <Map.OlView :center="[50.4501, 30.5234]" :zoom="3" />

      <!-- Dark Map -->
      <Layers.OlTileLayer>
        <Sources.OlSourceXyz :url="cartoDarkUrl" />
      </Layers.OlTileLayer>
      <!-- Dark Map -->

      <!-- Users -->
      <Layers.OlVectorLayer :source="usersVectorSource" />
      <!-- Users -->
    </Map.OlMap>
  </section>
</template>
