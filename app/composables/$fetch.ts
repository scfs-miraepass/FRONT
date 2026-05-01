import { ofetch } from 'ofetch'

export const $fetch = ofetch.create({
    credentials: "include",
    async onRequest({options}) {
        if (import.meta.env.SSR) {
            const {origin} = useRequestURL()
            options.baseURL = `${origin}/ser/api/`
        } else {
            options.baseURL = '/ser/api/'
        }
    }
})
