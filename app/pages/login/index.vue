<script setup lang="ts">
import { Motion } from "motion-v"
import type { UserType } from "@/sdk"

definePageMeta({
    layout: false
})

const [scope, animate] = useAnimate()
const route = useRoute()
const disableOpening = route.query.disableOpening === "true"

const typeSelect = (type: UserType) => {
    // 완전히 보였을 때 부터 선택 이벤트가 처리 되도록
    if (scope.value && Number(window.getComputedStyle(scope.value).opacity) < 0.8) return
    navigateTo(`/login/${type}`, { replace: true })
}
</script>

<template>
    <Motion
        as="div"
        class="w-screen h-screen p-7 flex flex-col justify-center items-center absolute top-0 left-0"
        :initial="{ opacity: 1 }"
        :animate="{ opacity: 0 }"
        :transition="{
            duration: 0.8,
            delay: 2.5,
            ease: [0, 0.71, 0.2, 1.01],
        }"
        v-if="!disableOpening"
    >
        <Motion
            as="p"
            class="text-h6 font-bold"
            :initial="{ opacity: 0, translateY: '20px' }"
            :animate="{ opacity: 1, translateY: '0' }"
            :transition="{
                duration: 1,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
            }"
        >
            안녕하세요!
        </Motion>
        <Motion
            as="div"
            class="flex items-center justify-center text-p0 mt-1.5"
            :initial="{ opacity: 0, translateY: '20px' }"
            :animate="{ opacity: 1, translateY: '0' }"
            :transition="{
                duration: 0.8,
                delay: 1.0,
                ease: [0, 0.71, 0.2, 1.01],
            }"
        >
            <LogoSymbol size="20px" />
            <span class="text-primary ml-1">미래 패스</span>에 오신걸 환영해요
        </Motion>
    </Motion>

    <Motion
        as="div"
        class="w-screen h-screen p-7 flex flex-col absolute top-0 left-0"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{
            duration: 1,
            delay: disableOpening? 0:2.5,
            ease: [0, 0.71, 0.2, 1.01],
        }"
        ref="scope"
    >
        <div class="flex-1 flex flex-col py-20">
            <p class="text-h6 font-bold">먼저 선택해주세요.</p>
            <div class="flex-1 flex flex-col items-center justify-center gap-3">
                <div class="flex items-center justify-center gap-3 w-full">
                    <UButton color="neutral" variant="outline" class="w-full aspect-square flex flex-col rounded-2xl" block @click="typeSelect('student')">
                        <p class="text-h1 tossface">🧑‍🎓</p>
                        <p class="text-h5 mt-2">학생</p>
                    </UButton>
                    <UButton color="neutral" variant="outline" class="w-full aspect-square flex flex-col rounded-2xl" block @click="typeSelect('teacher')">
                        <p class="text-h1 tossface">🧑‍🏫</p>
                        <p class="text-h5 mt-2">교사</p>
                    </UButton>
                </div>
                <UButton color="neutral" variant="outline" class="w-full flex rounded-2xl py-5" block @click="typeSelect('service')">
                    <p class="text-h6 tossface">💼</p>
                    <p class="text-h6">서비스</p>
                </UButton>
            </div>
        </div>
    </Motion>

</template>

<style scoped>
body {
    @apply overflow-hidden
}
</style>