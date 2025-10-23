import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './services/api'
import { useAuthStore } from './stores/auth'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())

// Initialize auth state after Pinia is set up
const authStore = useAuthStore()
authStore.initializeAuth()

app.use(router)

// Make axios instance available globally
app.config.globalProperties.$http = api

app.mount('#app')
