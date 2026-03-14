import { getCurrentUserAuthGet } from "@/sdk"

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.client) {
        const session = useSession()

        // 이미 세션 정보가 있다면 API 호출 없이 통과
        if (session.value) {
            if (to.path.startsWith("/login")) {
                return navigateTo("/")
            }
            return
        }

        const req = await getCurrentUserAuthGet()

        if (to.path.startsWith("/login")) {
            if (!req.error) {
                session.value = req.data.data
                return navigateTo("/")
            }
            return
        }
        if (req.error) {
            return navigateTo("/login", { replace: true })
        }
        session.value = req.data.data
    }
})
