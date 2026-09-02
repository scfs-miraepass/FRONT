<script setup lang="ts">
import { Motion } from "motion-v";
import { ref } from "vue";
import { useQuest } from "@/composables/useQuest";
import type { UserType } from "~/sdk";

definePageMeta({
    permissions: ['teacher'] as UserType[]
})

const QUEST_MIN_REWARD = 1
const QUEST_MAX_REWARD = 1000
const title = ref('')
const description = ref('')
const reward = ref(0)
const end_date = ref<string>(new Date().toISOString().split('T')[0] ?? '')
const { createQuest: createQuestAction, isLoading, error } = useQuest()

const createQuest = async () => {
    if (isLoading.value) {
        return
    }

    if (!title.value) {
        alert('퀘스트 제목을 입력해주세요.')
        return
    }

    if (!description.value) {
        alert('퀘스트 내용을 입력해주세요.')
        return
    }

    if (reward.value < QUEST_MIN_REWARD) {
        alert(`퀘스트 보상은 최소 ${QUEST_MIN_REWARD}포인트 이상 입력해야 합니다.`)
        return
    }

    if (reward.value > QUEST_MAX_REWARD) {
        alert(`퀘스트 보상은 최대 ${QUEST_MAX_REWARD}포인트까지 입력할 수 있습니다.`)
        return
    }

    const created = await createQuestAction({
        title: title.value,
        description: description.value,
        reward: reward.value,
        end_date: end_date.value,
    })

    if (!created) {
        alert(error.value ?? '퀘스트 생성에 실패했어요.')
        return
    }

    alert('퀘스트가 생성되었어요.')
    navigateTo('/system/quest-list')
}
</script>

<template>
    <div class="mx-auto w-full max-w-6xl space-y-4">
        <div class="flex items-center mb-4">
            <UButton 
                @click="$router.back()" 
                color="neutral" 
                variant="ghost" 
                icon="i-ph-caret-left-bold" 
                class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" 
                size="xl" 
            />
            <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">퀘스트 생성</p>
        </div>

        <div class="space-y-4">
            <Motion
                as="div"
                class="relative overflow-hidden rounded-3xl border border-default light:bg-default dark:bg-muted p-5 shadow-sm"
                :initial="{ opacity: 0, y: 14, scale: 0.99 }"
                :animate="{ opacity: 1, y: 0, scale: 1 }"
                :transition="{ duration: 0.45, ease: [0, 0.71, 0.2, 1.01] }"
            >
                <div class="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                <div class="relative flex flex-col gap-2">
                    <p class="text-ui-p3 uppercase tracking-[0.28em] light:text-black/40 dark:text-white/40">Quest Creator</p>
                    <p class="text-p0 light:text-black/70 dark:text-white/70">새로운 퀘스트를 등록하세요.</p>
                </div>
            </Motion>

            <div class="rounded-3xl border border-default light:bg-default dark:bg-muted p-6 shadow-sm">
                <div class="grid gap-5 md:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.9fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.9fr)]">
                    <div class="min-w-0 space-y-4 md:min-h-full md:flex md:flex-col">
                        <UInput 
                            v-model="title" 
                            placeholder="퀘스트 제목" 
                            size="xl" 
                            :ui="{ base: 'rounded-2xl' }" 
                            class="w-full" 
                        />
                        <UTextarea 
                            v-model="description" 
                            placeholder="퀘스트 내용" 
                            size="xl" 
                            :ui="{ base: 'rounded-2xl' }" 
                            :rows="11" 
                            class="w-full md:flex-1" 
                        />
                    </div>

                    <div class="min-w-0 space-y-5 md:min-h-full flex flex-col justify-between">
                        <div class="space-y-5">
                            <div class="space-y-3">
                                <p class="text-ui-p2 light:text-black/60 dark:text-white/60">보상 포인트</p>
                                <UInput 
                                    v-model.number="reward" 
                                    type="number" 
                                    placeholder="0" 
                                    min="1"
                                    max="300"
                                    size="xl" 
                                    :ui="{ base: 'rounded-2xl' }" 
                                    class="w-full" 
                                />
                                <p class="text-ui-p3 leading-5 light:text-black/55 dark:text-white/55 flex items-start gap-2 pl-4">
                                    <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                    퀘스트 완료 시 학생이 받을 포인트입니다.
                                    <br/>
                                    최대 {{ QUEST_MAX_REWARD }} 포인트까지 설정할 수 있어요.
                                </p>
                            </div>

                            <div class="space-y-3">
                                
                            </div>

                            <div class="space-y-3">
                                <p class="text-ui-p2 light:text-black/60 dark:text-white/60">종료일</p>
                                <UInput 
                                    v-model="end_date" 
                                    type="date" 
                                    size="xl" 
                                    :ui="{ base: 'rounded-2xl' }" 
                                    class="w-full" 
                                />
                                <p class="text-ui-p3 leading-5 light:text-black/55 dark:text-white/55 flex items-start gap-2 pl-4">
                                    <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                    이 날짜가 지나면 퀘스트는 자동으로 종료돼요.
                                </p>
                            </div>
                        </div>

                        <div class="pt-4">
                            <UButton 
                                :loading="isLoading" 
                                @click="createQuest" 
                                size="xl" 
                                color="primary" 
                                class="w-full justify-center rounded-2xl py-4.5"
                            >
                                <p class="text-p0">생성하기</p>
                            </UButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>