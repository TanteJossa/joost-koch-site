import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import GptView from '@/views/GptView.vue'
import MotieView from '@/views/MotieView.vue'
import { resolveAssetUrl } from '@/services/asset-resolver.js';
const routes = [
    {
        path: '/files/:fileName',
        name: 'fileViewer',
        // We use a `beforeEnter` guard to avoid creating an unnecessary component.
        beforeEnter: async (to, from, next) => {
            const fileName = to.params.fileName;
            const fileUrl = await resolveAssetUrl(fileName);

            if (fileUrl) {
                // If the file is found, redirect the browser directly to the asset URL.
                // The browser will then handle displaying or downloading the file.
                window.location.href = fileUrl;
                // We don't call next() because the browser is navigating away.
            } else {
                // If the file is not found, redirect to a 'NotFound' page or the homepage.
                // This assumes you have a route named 'NotFound'. If not, use next({ path: '/' });
                alert('Bestand niet gevonden \n U wordt teruggestuurd naar de home pagina')
                console.warn(`File not found for route: /files/${fileName}`);
                next({
                    name: 'NotFound'
                });
            }
        },
    },
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
        name: 'Home',
        component: HomeView
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router
