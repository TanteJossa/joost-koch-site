// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import vuePugPlugin from 'vue-pug-plugin'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    assetsInclude: ['**/*.md'],
    plugins: [
        Vue({
            template: {
                transformAssetUrls,
                preprocessOptions: {
                    vuePugPlugin
                }
            }
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify(),
        Components(),
        ViteFonts({
        google: {
            families: [{
                name: 'Roboto',
                styles: 'wght@100;300;400;500;700;900',
            }],
        },
        }),
    ],
    define: { 'process.env': {} },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    server: {
        port: 3000,
    },
    css: {
        preprocessorOptions: {
        sass: {
            api: 'modern-compiler',
        },
        },
    },
    build: {
        sourcemap: 'hidden' // Generates sourcemap but doesn't link it
    }
})
