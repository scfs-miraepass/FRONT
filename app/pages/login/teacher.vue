<script setup lang="ts">
import { Motion } from "motion-v";
import { checkPasswordExistsAuthPasswordExistsUserIdGet, changePasswordNewAuthPasswordPost, loginAuthLoginPost } from "@/sdk"

const toast = useToast()
const teacherName = ref<string>('');
const password = ref<string>('');
const password_confirm = ref<string>('');
let loadingTimeout: any = null;

const step1 = reactive<{
    password: boolean | null,
    loading: boolean
    error?: string
}>({
    password: null,
    loading: false,
    error: undefined
})

const passwordCheck = async () => {
    if (!teacherName.value) return
    step1.error = undefined

    loadingTimeout = setTimeout(() => {
        step1.loading = true
    }, 100)


    // TODO
    const req = await checkPasswordExistsAuthPasswordExistsUserIdGet({
        path: {
            user_id: teacherName.value
        }
    })

    if (loadingTimeout) clearTimeout(loadingTimeout)

    if (req.error) {
        step1.loading = false
        step1.error = ""
        toast.add({
            title: '이름을 확인해주세요!',
            description: '등록된 교사을 찾지 못했어요. 동일한 문제가 발생하면 담당자에게 문의해주세요.',
            color: "error"
        })
        return
    }
    step1.password = req.data.data
    step1.loading = false
}

const login = async () => {
    if (step1.password == false) {
        // 초기 접속하여 비밀번호 변경을 해야하는 경우
        const req = await changePasswordNewAuthPasswordPost({
            body: {
                user: teacherName.value,
                password: password.value
            }
        })
        if (req.error) {
            // TODO: 에러처리
            return
        }
    }

    // TODO
    const req = await loginAuthLoginPost({
        body: {
            id: teacherName.value,
            password: password.value
        }
    })
    if (req.error) {
        if (req.response.status == 401) {
            toast.add({
                title: '비밀번호가 맞지 않아요.',
                description: '비밀번호를 잊어다면 담당자에게 문의해주세요.',
                color: "error"
            })
        }
        return
    }
    await navigateTo("/", { replace: true })
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
            <p class="text-h6 font-bold" v-if="step1.password == null">이름을<br />입력해주세요.</p>
            <p class="text-h6 font-bold" v-if="step1.password == true">비밀번호를<br />입력해주세요.</p>
            <p class="text-h6 font-bold" v-if="step1.password == false">비밀번호를<br />설정해주세요.</p>
            <div class="flex flex-col flex-1 gap-4 mt-15">
                <UFormField label="이름" class="w-full" help="성을 포함해서 전체 이름을 입력해주세요." :error="step1.error">
                    <UInput
                        type="text"
                        minlength="2"
                        maxlength="4"
                        size="xl"
                        class="w-full"
                        :disabled="step1.password != null"
                        v-model="teacherName"
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
                        <UInput type="password" class="w-full" size="xl" v-model="password" />
                    </UFormField>

                    <UFormField label="비밀번호" class="w-full" v-if="step1.password == false" :error="password.length < 8 || password.length > 15? '비밀번호는 8~15자 사이여야 해요.':undefined">
                        <UInput type="password" class="w-full" size="xl" v-model="password" />
                    </UFormField>
                    <UFormField label="비밀번호 검증" class="w-full" v-if="step1.password == false" :error="password !== password_confirm? '비밀번호가 일치하지 않아요.':undefined">
                        <UInput type="password" class="w-full" size="xl" v-model="password_confirm" />
                    </UFormField>
                </Motion>
            </div>
        </div>
        <UButton
            class="rounded-2xl justify-center flex py-4.5 transition-opacity"
            :disabled="step1.password == null? teacherName.length <= 2:(password.length < 8 || password.length > 15 || (step1.password == false && password !== password_confirm))"
            :loading="step1.loading"
            @click="step1.password == null? passwordCheck():login()"
        >
            <p class="text-p0">{{ step1.password == null? '다음 단계':'로그인 하기' }}</p>
        </UButton>
    </Motion>
</template>