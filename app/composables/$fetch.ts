import { ofetch } from 'ofetch'

export const $fetch = ofetch.create({
    onRequest({ options }) {
        const config = useRuntimeConfig()
        options.baseURL = config.public.apiBase as string
    }
})
