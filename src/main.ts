import { createApp } from 'vue'
import App from './App.vue'

import '@/styles/main.css'
import { router, Routes } from './lib/routes'

const app = createApp(App)

await Routes.replaceRoutesProperly();
app.use(router)
app.mount('#app')
