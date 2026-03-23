import type { UserType } from "@/sdk"

const consoleLog = (message: string, ...args: any[]) => {
    console.log(
        `%cPermissions Middleware%c ${message}`,
        'background: oklch(48.8% 0.243 264.376); color: white; padding: 2px 6px; border-radius: 4px; font-weight: 600;',
        'color: inherit;',
        ...args
    )
}


export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {
        const session = useSession()
        const requiredPermissions = to.meta.permissions as UserType[]

        // 페이지에 필요한 역할이 정의되지 않았으면 통과
        if (!requiredPermissions || requiredPermissions.length <= 0) {
            consoleLog("페이지 권한이 설정되어 있지 않음.")
            return
        }

        if (session.value) {
            const userType = session.value.type
            // 사용자의 역할이 페이지에서 요구하는 역할 중 하나가 아니라면
            if (!requiredPermissions.includes(userType)) {
                consoleLog("세션 유저가 페이지가 요구하는 역할과 일치하지 않습니다.")
                throw createError({ statusCode: 403, statusMessage: '접근 권한이 없습니다.' })
            }
            consoleLog("권한 확인 완료")
        } else {
            consoleLog("세션이 없음")
        }
        // 세션이 없는 경우는 auth.global.ts 에서 처리하므로 여기서는 다루지 않음.
    }
})
