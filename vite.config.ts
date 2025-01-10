import { fileURLToPath, URL } from 'node:url';
import EnvironmentPlugin from 'vite-plugin-environment';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler' // or "modern"
            }
        },
        postcss: {
            plugins: [tailwind(), autoprefixer()]
        }
    },
    plugins: [
        vueDevTools(),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('velt-')
                }
            }
        }),
        EnvironmentPlugin('all')
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
