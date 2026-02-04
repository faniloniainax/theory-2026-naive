import { createApp } from 'vue'
import App from './App.vue'

import '@/styles/main.css'
import useRoutes from './composables/core/useRoutes';

const app = createApp(App);
const { router, useTypeDependentRoutes } = useRoutes();

await useTypeDependentRoutes();
app.use(router)
app.mount('#app')
