import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    vite: {
        plugins: [tailwindcss()],
        server: {
            allowedHosts: true, // DEV Only
        },
    },

    app: {
        head: {
            link: [
                { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
                { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
                {
                    rel: "icon",
                    href: "/favicon.svg",
                    sizes: "any",
                    type: "image/svg+xml",
                },
            ],
            meta: [
                {
                    name: "theme-color",
                    content: "#F1F5F9",
                    media: "(prefers-color-scheme: light)",
                },
                {
                    name: "theme-color",
                    content: "#0f172b",
                    media: "(prefers-color-scheme: dark)",
                },
            ],
        },
    },

    css: ["./app/assets/styles/main.css", "./app/assets/styles/tossface.css"],

    runtimeConfig: {
        public: {
            apiBase: "http://localhost:8000/", // NUXT_PUBLIC_API_BASE
        },
    },

    modules: [
        "@nuxt/fonts",
        "@nuxtjs/device",
        "motion-v/nuxt",
        "@nuxt/ui",
        "@vite-pwa/nuxt",
    ],

    fonts: {
        families: [{ name: "Pretendard", provider: "local" }],
    },
    pwa: {
        includeAssets: ["favicon.ico", "apple-touch-icon.png"],
        client: {
            installPrompt: true,
        },
        workbox: {
            navigateFallback: "/",
            globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        },
        devOptions: {
            enabled: true, // DEV Only
            type: "classic",
        },
        manifest: {
            name: "미래패스",
            short_name: "미래패스",
            lang: "ko",
            icons: [
                {
                    src: "/pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/pwa-maskable-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "maskable",
                },
                {
                    src: "/pwa-maskable-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable",
                },
            ],
            start_url: "/",
            display: "standalone",
            background_color: "#F1F5F9",
            theme_color: "#F1F5F9",
        },
    },
});
