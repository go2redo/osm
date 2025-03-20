import 'vue3-openlayers/styles.css'
import './assets/main.css'

import OpenLayersMap from 'vue3-openlayers'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(OpenLayersMap)

app.mount('#app')
