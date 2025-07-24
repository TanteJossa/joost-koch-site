/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'


// Components
import App from './App.vue'


// Composables
import { createApp } from 'vue'

import { createPinia } from 'pinia'
import pdfUtilsPlugin from './pdf_utils';
import analyticsPlugin from './plugins/analytics';
import router from '@/router'

const app = createApp(App)

app
    .use(createPinia())
    .use(pdfUtilsPlugin)
    .use(analyticsPlugin)
    .use(router)

registerPlugins(app)

app.mount('#app')
