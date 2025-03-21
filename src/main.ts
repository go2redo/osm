import 'vue3-openlayers/styles.css'
import './assets/main.css'

import OpenLayersMap from 'vue3-openlayers'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(OpenLayersMap)
app.use(plugin, defaultConfig)

app.mount('#app')
