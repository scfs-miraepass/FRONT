import type { UseFetchOptions, KeysOf } from 'nuxt/app'
import { $fetch } from "./$fetch"

export const useAPI = <T, ResT = T, Keys extends KeysOf<ResT> = KeysOf<ResT>>(
    url: string | (() => string),
    options?: UseFetchOptions<T, ResT, Keys>,
) => {
    return useFetch<T, ResT, Keys>(url, {
        ...options,
        $fetch: $fetch as typeof globalThis.$fetch
    })
}
