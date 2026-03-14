// plugins/api-client.ts
import { client } from '@/sdk/client.gen'
import { fetchOption } from "~/composables/$fetch";

export default defineNuxtPlugin((nuxtApp) => {
    // SDK의 기본 설정 구성
    client.setConfig({
        ...fetchOption,
        baseUrl: nuxtApp.$config.public.apiBase
    })
})