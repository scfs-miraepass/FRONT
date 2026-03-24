<script setup lang="ts">
import { Motion } from "motion-v";
import {
    type UserType,
    type User,
    grantPointsPointGrantPost,
    deductPointsPointDeductPost
} from "@/sdk"

definePageMeta({
    middleware: [
        (to, from) => {
            const userData = useState<User | undefined>("service.point.user.data")
            if (!userData.value) {
                return navigateTo("/", { replace: true })
            }
        }
    ],
    permissions: ['teacher', 'service'] as UserType[]
})

const session = useSession()
const userData = useState<User>("service.point.user.data")
const amount = ref<number>(0)
const isConfirm = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isComplete = ref<boolean>(false)
const isDeduct = computed<boolean>(() => session.value?.type == "service")

const pointError = ref<boolean>(false)
const [pointScope, pointAnimate] = useAnimate()

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

const triggerVibration = (pattern?: number) => {
    // 모바일에서 진동 함수
    // TODO: iOS 사파리에선 API 지원 안하는데 어떻게 하실
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(pattern ?? 10)
    }
}

const onInput = (val: string) => {
    triggerVibration()
    const currentStr = String(amount.value)
    if (currentStr.length >= 6) return // 최대 6자리 제한

    // 초기값이 0이면 새 숫자로 교체, 아니면 뒤에 추가
    const _new = amount.value === 0 ? Number(val) : Number(currentStr + val)
    if (isDeduct.value && _new > userData.value.point!) {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate(20)
            setTimeout(() => window.navigator.vibrate(100), 100)
        }
        pointError.value = true
        pointAnimate(pointScope.value, { translate: "20px" }, { type: "spring", stiffness: 700, damping: 3, mass: 0.5 })
        setTimeout(() => pointAnimate(pointScope.value, { translate: '0' }, { type: "spring", stiffness: 700, damping: 3, mass: 0.5 }), 25)
        return
    }
    pointError.value = false
    amount.value = _new
}

const onDelete = () => {
    triggerVibration()
    const currentStr = String(amount.value)
    if (currentStr.length <= 1) {
        amount.value = 0
    } else {
        amount.value = Number(currentStr.slice(0, -1))
    }
    pointError.value = false
}

const onButton = async () => {
    isLoading.value = true

    let req
    if (isDeduct.value) {
        // 차감 처리
        req = await deductPointsPointDeductPost({
            body: {
                target_user_id: userData.value.id!,
                amount: amount.value,
                change_type: userData.value.history_type
            }
        })
    } else {
        // 지급 처리
        req = await grantPointsPointGrantPost({
            body: {
                target_user_id: userData.value.id!,
                amount: amount.value,
                change_type: userData.value.history_type || "teacher"
            }
        })
    }
    if (req.error) {
        // TODO: 에러처리
        return
    }
    isComplete.value = true
}
</script>

<template>
    <div class="flex-1 overflow-hidden flex flex-col relative">
        <div class="flex items-center mb-4 z-10">
            <NuxtLink to="/" v-slot="{ navigate }" custom>
                <UButton :disabled="isConfirm" @click="navigate()" color="neutral" variant="ghost" icon="i-ph-caret-left-bold" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
            </NuxtLink>
        </div>
        <div class="flex-1 flex flex-col transition" :class="{'pointer-events-none opacity-0 -translate-x-4': isComplete}">
            <div class="flex-1 flex flex-col">
                <!-- 상단 타이틀 -->
                <div class="mt-10" v-if="isDeduct">
                    <p class="text-p0 light:text-black/70 dark:text-white/70 font-normal"><span class="font-bold light:text-black dark:text-white">{{ userData.name }}</span> 학생의 포인트에서</p>
                    <p class="text-p0 text-black/70 dark:text-white/70 font-normal">얼마나 결제할까요?</p>
                </div>
                <div class="mt-10" v-else>
                    <p class="text-p0 light:text-black/70 dark:text-white/70 font-normal"><span class="font-bold light:text-black dark:text-white">{{ userData.name }}</span> 학생에게 포인트를</p>
                    <p class="text-p0 text-black/70 dark:text-white/70 font-normal">얼마나 지급할까요?</p>
                </div>

                <!-- 지급/차감할 포인트 UI -->
                <div class="flex flex-col items-center justify-center flex-1 mb-11.5">
                    <div class="flex items-center">
                        <span class="text-h2 font-bold">{{ amount.toLocaleString() }}</span>
                        <span class="text-h4">P</span>
                    </div>
                    <p
                        class="text-ui-p2 mt-2 px-3 py-1.5 rounded-xl dark:bg-muted light:text-black/45 dark:text-white/40 transition-colors"
                        :class="{ 'text-error!': pointError }"
                        v-if="isDeduct"
                        ref="pointScope"
                    >
                        {{ userData.point!.toLocaleString() }} 포인트 사용가능
                    </p>
                </div>
            </div>
            <p class="text-ui-p2 mb-5 flex items-center justify-center light:text-black/50 dark:text-white/50 transition-opacity" :class="[isConfirm? 'opacity-100':'opacity-0']">
                <UIcon name="i-ph-warning" class="mr-1" />
                {{ isDeduct? '결제가 진행된 이후에는 취소할 수 없어요.':'지급된 이후에는 회수할 수 없어요.' }}
            </p>
            <div class="flex gap-3 mb-3">
                <UButton
                    class="rounded-2xl justify-center flex py-4.5 transition-opacity w-full"
                    :disabled="amount <= 0 || pointError"
                    @click="isConfirm = true"
                    v-if="!isConfirm"
                >
                    <p class="text-p0">다음</p>
                </UButton>
                <UButton
                    class="rounded-2xl justify-center flex py-4.5 transition-opacity w-full"
                    :disabled="isLoading"
                    :loading="isLoading"
                    @click="onButton"
                    v-else
                >
                    <p class="text-p0">{{ !isLoading? (isDeduct? '결제하기':'지급하기'):'처리중..' }}</p>
                </UButton>
                <Motion
                    class="h-auto aspect-square"
                    :initial="{ marginRight: '-100%' }"
                    :animate="{ marginRight: (!isConfirm || isLoading) ? '-100%' : 0 }"
                    :transition="{
                        type: 'spring',
                        duration: (!isConfirm || isLoading)? 2.4:0.8,
                        bounce: 0.15
                    }"
                >
                    <UButton
                        color="error"
                        variant="soft"
                        class="rounded-2xl justify-center flex py-4.5 transition-opacity text-nowrap w-full h-full"
                        :disabled="isLoading"
                        @click="isConfirm = false"
                    >
                        <p class="text-p0">취소</p>
                    </UButton>
                </Motion>
            </div>
            <Motion
                as="div"
                class="w-full h-[30vh] grid grid-cols-3 grid-rows-4"
                :initial="{ marginBottom: 0 }"
                :animate="{ marginBottom: isConfirm? '-30vh':0 }"
                :transition="{
                    type: 'spring',
                    stiffness: 950,
                    damping: 80,
                    mass: 1
                }"
            >
                <button
                    v-for="num in keypad"
                    :key="num"
                    @click="onInput(num)"
                    class="rounded-xl gap-2 px-5.5 py-3 transition-all active:scale-95 active:opacity-50 active:bg-accented text-h6 text-center"
                >
                    {{ num }}
                </button>
                <div />
                <button @click="onInput('0')" class="rounded-xl gap-2 px-5.5 py-3 transition-all active:scale-95 active:opacity-50 active:bg-accented text-h6 text-center">
                    0
                </button>
                <button @click="onDelete" class="rounded-xl gap-2 px-5.5 py-3 transition-all active:scale-95 active:opacity-50 active:bg-accented text-h5 text-center">
                    <UIcon name="i-ph-arrow-left" />
                </button>
            </Motion>
        </div>
        <div class="pt-10 h-full w-full flex flex-col items-center justify-center absolute transition" :class="{'pointer-events-none opacity-0 translate-x-4': !isComplete}">
            <div class="h-full flex flex-col justify-center items-center text-ui-p1 opacity-50">
                <UIcon name="i-ph-check-circle" class="text-h2 mb-1.5" />
                {{ isDeduct? '결제가 정상적으로 되었어요.':'정상적으로 지급되었어요.' }}
            </div>
            <NuxtLink to="/" v-slot="{ navigate }" custom>
                <UButton
                    class="rounded-2xl justify-center flex py-4.5 transition-opacity mb-3 w-full"
                    @click="navigate()"
                >
                    <p class="text-p0">돌아가기</p>
                </UButton>
            </NuxtLink>
        </div>
    </div>
</template>