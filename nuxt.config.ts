import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    css: ["./app/assets/styles/main.css", "./app/assets/styles/tossface.css"],

    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:8000/', // NUXT_PUBLIC_API_BASE
        },
    },

    modules: ['@nuxt/fonts', '@nuxtjs/device', 'motion-v/nuxt', '@nuxt/ui', '@vite-pwa/nuxt'],

    fonts: {
        families: [
            { name: 'Pretendard', provider: 'local' }
        ]
    },
})