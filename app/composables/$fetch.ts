import { ofetch, type FetchOptions } from 'ofetch'
import type { Config } from "@/sdk/client";

// SDK, Fetch 인스터스 공통 옵션
export const fetchOption: FetchOptions & Config = {
    credentials: "include",
    async onRequest({options}) {
        if (import.meta.env.SSR) {
            const {origin} = useRequestURL()
            options.baseURL = `${origin}/api`
        } else {
            options.baseURL = '/api'
        }
    }
}

export const $fetch = ofetch.create({
    ...fetchOption
})
