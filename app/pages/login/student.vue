<script setup lang="ts">
import { Motion } from "motion-v";
import { checkPasswordExistsAuthPasswordExistsUserIdGet } from "@/sdk"

const studentId_payload = ref<number[]>([]);
let loadingTimeout: any = null;

const step1 = reactive<{
    password: boolean | null,
    loading: boolean
}>({
    password: null,
    loading: false
})

const studentId = computed<number>(() => Number(studentId_payload.value?.join('')))

const passwordCheck = async () => {
    console.log(studentId.value)
    if (!studentId.value) return

    loadingTimeout = setTimeout(() => {
        step1.loading = true
    }, 100)


    const req = await checkPasswordExistsAuthPasswordExistsUserIdGet({
        path: {
            user_id: studentId.value
        }
    })

    if (loadingTimeout) clearTimeout(loadingTimeout)

    if (req.error) {
        step1.loading = false
        // TODO: 학번에 따른 유저를 찾지 못했을 경우
        return
    }
    step1.password = req.data.data
    step1.loading = false
}

const login = () => {

}


</script>

<template>
    <Motion
        as="div"
        class="w-screen h-screen p-7 flex flex-col absolute"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{
            duration: 1,
            ease: [0, 0.71, 0.2, 1.01],
        }"
        ref="scope"
    >
        <div class="flex-1 flex flex-col py-20">
            <p class="text-h6 font-bold" v-if="step1.password == null">학번을<br />입력해주세요.</p>
            <p class="text-h6 font-bold" v-if="step1.password == true">비밀번호를<br />입력해주세요.</p>
            <p class="text-h6 font-bold" v-if="step1.password == false">비밀번호를<br />설정해주세요.</p>
            <div class="flex flex-col flex-1 gap-4 mt-15">
                <UFormField label="학번" class="w-full" help="3학년 4반 6번 → 3046">
                    <UPinInput
                        type="number"
                        :length="4"
                        size="xl"
                        :disabled="step1.password != null"
                        v-model="studentId_payload"
                    />
                </UFormField>
                <Motion
                    as="div"
                    class="flex flex-col gap-4"
                    :initial="{ opacity: 0, translateY: '20px' }"
                    :animate="{ opacity: 1, translateY: '0' }"
                    :transition="{
                        duration: 0.8,
                        ease: [0, 0.71, 0.2, 1.01],
                    }"
                    v-if="step1.password != null"
                >
                    <UFormField label="비밀번호" class="w-full" v-if="step1.password == true">
                        <UInput type="password" class="w-full" size="xl" />
                    </UFormField>

                    <UFormField label="비밀번호" class="w-full" v-if="step1.password == false">
                        <UInput type="password" class="w-full" size="xl" />
                    </UFormField>
                    <UFormField label="비밀번호 검증" class="w-full" v-if="step1.password == false">
                        <UInput type="password" class="w-full" size="xl" />
                    </UFormField>
                </Motion>
            </div>
        </div>

        <UButton
            class="rounded-2xl justify-center flex py-4.5 transition-opacity"
            :disabled="step1.password == null? !((studentId ?? 0) >= 1101 && (studentId ?? 0) <= 3699):true"
            :loading="step1.loading"
            @click="step1.password == null? passwordCheck():login()"
        >
            <p class="text-p0">{{ step1.password == null? '다음 단계':'로그인 하기' }}</p>
        </UButton>
    </Motion>
</template>