import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

registerSW({ immediate: true })
