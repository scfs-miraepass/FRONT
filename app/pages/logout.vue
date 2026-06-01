<script setup lang="ts">
import { logoutAuthLogoutPost } from "@/sdk";

definePageMeta({
    layout: false
})
const session = useSession()

onMounted(async () => {
    const req = await logoutAuthLogoutPost()
    if (!req.error) {
        session.value = undefined
        await navigateTo("/login", { replace: true })
    }
})
</script>

<template>
    <div class="w-screen h-screen flex items-center justify-center text-p1">
        <USkeleton class="bg-transparent flex flex-col items-center">
            <LogoSymbol class="mb-2" />
            로그아웃 중이에요.. 잠시만 기다려주세요.
        </USkeleton>
    </div>
</template>