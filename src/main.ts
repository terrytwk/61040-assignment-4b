import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './services/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Make axios instance available globally
app.config.globalProperties.$http = api

app.mount('#app')
