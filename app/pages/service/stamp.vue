<script setup lang="ts">
import {
    type UserType,
    type User,
} from "@/sdk"
import Icon from "~/components/stamp/icon.vue";

definePageMeta({
    middleware: [
        (to, from) => {
            const userData = useState<User | undefined>("system.user-select.uesr")
            if (!userData.value) {
                return navigateTo("/", { replace: true })
            }
        }
    ],
    permissions: ['service'] as UserType[]
})

const userData = useState<User>("system.user-select.uesr")
const isLoading = ref<boolean>(false)
</script>

<template>
    <div class="flex-1 overflow-hidden flex flex-col relative">
        <div class="flex-1 flex flex-col">
            <div class="flex-1 flex flex-col">
                <div class="mt-24">
                    <p class="text-p0 light:text-black/70 dark:text-white/70 font-normal"><span class="font-bold light:text-black dark:text-white">{{ userData.name }}</span> {{ userData.type == 'student'? '학생':'선생님' }}에게</p>
                    <p class="text-p0 text-black/70 dark:text-white/70 font-normal">스탬프를 지급할까요?</p>
                </div>
                <div class="flex flex-col items-center mt-25">
                    <Icon enable class="w-25 h-25" />
                    <p class="text-p0 mt-2">제기찰겨? 날찰겨?</p>
                </div>
            </div>
            <p class="text-ui-p2 mb-5 flex items-center justify-center light:text-black/50 dark:text-white/50">
                <UIcon name="i-ph-warning" class="mr-1" />
                스탬프가 지급되면 추후 회수하거나 재지급 할 수 없어요.
            </p>
            <div class="space-y-3 mb-3">
                <UButton
                    class="rounded-2xl justify-center flex py-4.5 transition-opacity w-full"
                    :disabled="isLoading"
                    :loading="isLoading"
                >
                    <p class="text-p0">{{ !isLoading? '지급하기':'처리중..' }}</p>
                </UButton>
                <UButton
                    color="error"
                    variant="soft"
                    class="rounded-2xl justify-center flex py-4.5 transition-opacity w-full"
                    :disabled="isLoading"
                    @click="$router.back()"
                >
                    <p class="text-p0">취소</p>
                </UButton>
            </div>
        </div>
    </div>
</template>