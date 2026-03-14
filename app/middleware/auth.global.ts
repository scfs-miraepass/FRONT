import { getCurrentUserAuthGet } from "@/sdk"

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.client) {
        const req = await getCurrentUserAuthGet()
        if (to.path.startsWith("/login")) {
            if (!req.error) {
                return navigateTo("/")
            }
        }
        if (req.error) {
            return navigateTo("/login", { replace: true })
        }
        useSession().value = req.data.data
    }
})
