import { pwa } from './app/config/pwa'
import { appDescription } from './app/config/constant'

export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@vueuse/nuxt',
        '@unocss/nuxt',
        '@pinia/nuxt',
        '@nuxtjs/color-mode',
        '@vite-pwa/nuxt',
        '@element-plus/nuxt',
        'nuxt-particles',
        "@nuxtjs/i18n",
        'nuxt-swiper'
    ],

    experimental: {
        // when using generate, payload js assets included in sw precache manifest
        // but missing on offline, disabling extraction it until fixed
        // payloadExtraction: false,
        // renderJsonPayloads: true,
        typedPages: true,
    },

    css: [
        '@unocss/reset/tailwind.css',
    ],

    colorMode: {
        classSuffix: '',
    },

    nitro: {
        esbuild: {
            options: {
                target: 'esnext',
            },
        },
        // prerender: {
        //     crawlLinks: false,
        //     routes: ['/'],
        //     ignore: ['/hi'],
        // },
    },

    app: {
        head: {
            viewport: 'width=device-width,initial-scale=1',
            link: [
                { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
                { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
                { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
            ],
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: appDescription },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
                { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
                { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
            ],
        },
    },

    hooks: {
        'pages:extend': function (pages) {
            const pagesToRemove = pages.filter((page) => page.path.includes('component'))

            pagesToRemove.forEach((page) => {
                pages.splice(pages.indexOf(page), 1)
            })
        },
    },

    components: [
        '~/components',
        {
            path: '~/pages',
            pattern: '*/components/**',
            pathPrefix: false,
        },
    ],

    // ignore: ['/app/pages/**/components/**.vue'],
    imports: {
        dirs: ['config'],
    },

    pwa,

    runtimeConfig: {
        // 仅在服务端serve可以访问
        //         # 文件上传主机地址
        host: process.env.NUXT_UPLOAD_HOST,
        upload: {
            //         # 文件上传主机地址
            host: process.env.NUXT_UPLOAD_HOST,
            // # 文件上传保存路径
            dir: '/public/upload',
        },
        // public里的在服务端serve,客户端client皆可访问
        public: {
            // secret: process.env.NUXT_AUTH_SECRET, // You can generate one with `openssl rand -base64 32`
        },
    },

    devtools: {
        enabled: true,
    },

    features: {
        // For UnoCSS
        inlineStyles: false,
    },

    future: {
        compatibilityVersion: 4,
    },

    eslint: {
        config: {
            standalone: false, // <---
        },
    },

    compatibilityDate: '2024-07-03',
    i18n: {
        // locale: 'cn',
        locales: [
            {
                code: 'cn',
                name: '简体中文',
                file: 'cn.json',
            },
            {
                code: 'en',
                name: 'English',
                file: 'en.json',
            },

            // {
            //   code: 'fr',
            //   file: 'fr-FR.ts'
            // }
        ],
        lazy: true,
        langDir: 'lang',
        defaultLocale: 'cn', // default locale of your project for Nuxt pages and routings
        // strategy: 'prefix_except_default',
        detectBrowserLanguage: false,
        // detectBrowserLanguage: {
        //     useCookie: true,
        //     cookieKey: 'i18n_redirected',
        //     redirectOn: 'root', // recommended
        //     // alwaysRedirect: false,
        //     // fallbackLocale: 'cn',
        // },

        // customRoutes: 'page',
        // pages: {
        //     login: {
        //         en: false,
        //     },
        // },
    },
})