import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import GptView from '@/views/GptView.vue'
import MotieView from '@/views/MotieView.vue'
const routes = [
    {
        path: '/gpt',
        component: GptView
    },
    {
        path: '/motie',
        component: MotieView
    },
    {
        path: '/:pathMatch(.*)*',
        component: HomeView
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router
