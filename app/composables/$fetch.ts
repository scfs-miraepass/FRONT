import { ofetch, type FetchOptions } from 'ofetch'
import type { Config } from "~/sdk/client";

// SDK, Fetch 인스터스 공통 옵션
export const fetchOption: FetchOptions & Config = {
    credentials: "include",
}

export const $fetch = ofetch.create({
    ...fetchOption,
    onRequest({ options }) {
        const config = useRuntimeConfig()
        options.baseURL = config.public.apiBase as string
    }
})
