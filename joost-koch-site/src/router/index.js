import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import TestView from '@/views/TestView.vue'

const routes = [
  { path: '/', component: TestView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})


export default router