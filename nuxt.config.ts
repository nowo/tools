import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { appDescription } from './app/config/constant'

// 基于 Aura,把 primary 色阶换成项目 teal(设计稿强调色 #0E8C6B)
const ToolboxPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eafaf4',
            100: '#cbf0e2',
            200: '#9ee0c9',
            300: '#66cbab',
            400: '#33b08c',
            500: '#0e8c6b',
            600: '#0c7659',
            700: '#0a5f49',
            800: '#0a4c3b',
            900: '#093f31',
            950: '#04241c',
        },
    },
})

export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@vueuse/nuxt',
        '@unocss/nuxt',
        '@nuxtjs/color-mode',
        '@primevue/nuxt-module',
    ],

    primevue: {
        options: {
            theme: {
                preset: ToolboxPreset,
                options: {
                    // 暗色模式跟随 .dark class(与 @nuxtjs/color-mode 对齐)
                    darkModeSelector: '.dark',
                },
            },
        },
    },

    // 纯前端工具站:关闭 SSR,走 SPA / 静态生成
    ssr: false,

    experimental: {
        typedPages: true,
    },

    // reset 由 UnoCSS presetWind4 内置提供(preflights.reset),无需单独引入

    colorMode: {
        classSuffix: '',
    },

    app: {
        // baseURL: '/tools/',
        head: {
            viewport: 'width=device-width,initial-scale=1',
            link: [
                { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
                { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
            ],
            meta: [
                { name: 'description', content: appDescription },
                { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
                { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#152019' },
            ],
        },
    },

    imports: {
        dirs: ['config'],
    },

    devtools: {
        enabled: true,
    },

    future: {
        compatibilityVersion: 4,
    },

    eslint: {
        config: {
            standalone: false,
        },
    },

    compatibilityDate: '2024-07-03',
})
