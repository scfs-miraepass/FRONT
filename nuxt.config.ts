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
                // iOS Startup Images - Landscape
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_17_Pro_Max__iPhone_16_Pro_Max_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_Air_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/iPhone_11__iPhone_XR_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)', href: '/pwa/splash/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/13__iPad_Pro_M4_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/12.9__iPad_Pro_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/11__iPad_Pro_M4_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/11__iPad_Pro__10.5__iPad_Pro_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/10.9__iPad_Air_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/10.5__iPad_Air_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/10.2__iPad_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)', href: '/pwa/splash/8.3__iPad_Mini_landscape.png' },

                // iOS Startup Images - Portrait
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_17_Pro_Max__iPhone_16_Pro_Max_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_Air_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/iPhone_11__iPhone_XR_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', href: '/pwa/splash/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/13__iPad_Pro_M4_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/12.9__iPad_Pro_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/11__iPad_Pro_M4_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/11__iPad_Pro__10.5__iPad_Pro_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/10.9__iPad_Air_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/10.5__iPad_Air_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/10.2__iPad_portrait.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png' },
                { rel: 'apple-touch-startup-image', media: 'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', href: '/pwa/splash/8.3__iPad_Mini_portrait.png' },
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
                {
                    name: "viewport",
                    content: "initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no;",
                }
            ],
            htmlAttrs: {
                lang: 'ko',
            },
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
            installPrompt: false,
        },
        devOptions: {
            enabled: true, // DEV Only
            type: "module",
        },
        registerType: "autoUpdate",
        manifest: {
            name: "미래패스",
            short_name: "미래패스",
            lang: "ko",
            id: "/",
            icons: [
                {
                    src: "/pwa/pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/pwa/pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/pwa/pwa-maskable-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "maskable",
                },
                {
                    src: "/pwa/pwa-maskable-512x512.png",
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
