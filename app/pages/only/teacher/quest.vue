<script setup lang="ts">
import { Motion } from "motion-v";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import type { UserType } from "@/sdk";
import { useQuest } from "@/composables/useQuest";
import Section from "@/components/setting/section.vue";

definePageMeta({
    permissions: ['teacher'] as UserType[],
});

const { quests, isLoading, error, fetchQuests, createQuest, deleteQuest } = useQuest();

const title = ref("");
const description = ref("");
const reward = ref(0);
const end_date = ref("");
const successMessage = ref("");
const pageReady = ref(false);
const deleteModalOpen = ref(false);
const targetQuest = ref<{ id: number; title: string } | null>(null);
const animatedStats = ref({
    total: 0,
    active: 0,
    reward: 0,
});

const formatDate = (value: string) => new Date(value).toLocaleDateString();
const isExpired = (value: string) => new Date(value).getTime() < Date.now();
const getDeadlineText = (value: string) => {
    const target = new Date(value);
    const today = new Date();
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (Number.isNaN(diffDays)) return "마감일 정보 없음";
    if (diffDays < 0) return `마감됨 · ${formatDate(value)}`;
    if (diffDays === 0) return `오늘 마감 · ${formatDate(value)}`;
    return `D-${diffDays} · ${formatDate(value)}`;
};
const activeQuestCount = computed(() => quests.value.filter(quest => !isExpired(quest.end_date)).length);
const totalReward = computed(() => quests.value.reduce((sum, quest) => sum + quest.reward, 0));

const animateStats = () => {
    const start = performance.now();
    const duration = 520;
    const from = { ...animatedStats.value };
    const to = {
        total: quests.value.length,
        active: activeQuestCount.value,
        reward: totalReward.value,
    };

    const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        animatedStats.value = {
            total: Math.round(from.total + (to.total - from.total) * eased),
            active: Math.round(from.active + (to.active - from.active) * eased),
            reward: Math.round(from.reward + (to.reward - from.reward) * eased),
        };

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };

    requestAnimationFrame(tick);
};

watch([() => quests.value.length, activeQuestCount, totalReward], () => {
    if (pageReady.value) {
        animateStats();
    }
}, { immediate: true });

const create = async () => {
    if (!title.value || !description.value || !end_date.value || reward.value <= 0) {
        error.value = "모든 항목을 입력해주세요.";
        return;
    }

    const created = await createQuest({
        title: title.value,
        description: description.value,
        reward: reward.value,
        end_date: new Date(end_date.value).toISOString(),
    });

    if (created) {
        title.value = "";
        description.value = "";
        reward.value = 0;
        end_date.value = "";
        successMessage.value = "퀘스트가 생성되었어요.";
    }
};

const askRemove = (id: number, title: string) => {
    targetQuest.value = { id, title };
    deleteModalOpen.value = true;
};

const remove = async () => {
    if (!targetQuest.value) return;
    await deleteQuest(targetQuest.value.id);
    deleteModalOpen.value = false;
    targetQuest.value = null;
};

onBeforeMount(async () => {
    await fetchQuests();
});

onMounted(() => {
    requestAnimationFrame(() => {
        pageReady.value = true;
        animateStats();
    });
});
</script>

<template>
    <div class="mx-auto w-full max-w-6xl space-y-4">
        <div class="flex items-center mb-4">
            <NuxtLink to="/" v-slot="{ navigate }" custom>
                <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-caret-left-bold" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
            </NuxtLink>
            <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">퀘스트 관리</p>
        </div>

        <div class="space-y-4">
            <Motion
                as="div"
                class="relative overflow-hidden rounded-3xl border border-default bg-linear-to-br from-primary/10 via-default to-default p-5 shadow-sm"
                :initial="{ opacity: 0, y: 14, scale: 0.99 }"
                :animate="pageReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.99 }"
                :transition="{ duration: 0.45, ease: [0, 0.71, 0.2, 1.01] }"
            >
                <div class="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                <div class="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div class="max-w-2xl space-y-2">
                        <p class="text-ui-p3 uppercase tracking-[0.28em] light:text-black/40 dark:text-white/40">Quest Manager</p>
                        <h1 class="text-h4 font-bold text-gray-900 dark:text-white">퀘스트 운영 패널</h1>
                        <p class="text-ui-p2 leading-6 light:text-black/55 dark:text-white/55">
                            새 퀘스트를 만들고, 현재 등록된 퀘스트를 한 화면에서 관리할 수 있어요.
                        </p>
                    </div>
                    <div class="grid grid-cols-3 gap-3 sm:w-auto">
                        <div class="rounded-2xl border border-default bg-default/85 px-4 py-3 text-right shadow-sm">
                            <p class="text-ui-p3 light:text-black/40 dark:text-white/40">전체</p>
                            <p class="mt-1 text-p1 font-semibold tabular-nums">{{ animatedStats.total }}</p>
                        </div>
                        <div class="rounded-2xl border border-default bg-default/85 px-4 py-3 text-right shadow-sm">
                            <p class="text-ui-p3 light:text-black/40 dark:text-white/40">진행 중</p>
                            <p class="mt-1 text-p1 font-semibold tabular-nums">{{ animatedStats.active }}</p>
                        </div>
                        <div class="rounded-2xl border border-default bg-default/85 px-4 py-3 text-right shadow-sm">
                            <p class="text-ui-p3 light:text-black/40 dark:text-white/40">총 보상</p>
                            <p class="mt-1 text-p1 font-semibold tabular-nums">{{ animatedStats.reward.toLocaleString() }} P</p>
                        </div>
                    </div>
                </div>
            </Motion>

            <template v-if="error">
                <Motion
                    as="div"
                    class="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="pageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }"
                    :transition="{ duration: 0.25 }"
                >
                    {{ error }}
                </Motion>
            </template>

            <Section name="새 퀘스트 만들기">
                <div class="grid gap-5 md:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.9fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.9fr)]">
                    <div class="min-w-0 space-y-4 md:min-h-full md:flex md:flex-col">
                        <Motion
                            as="div"
                            :initial="{ opacity: 0, y: 12 }"
                            :animate="pageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }"
                            :transition="{ duration: 0.35 }"
                        >
                            <UInput v-model="title" label="제목" placeholder="예: 2학기 중간고사 정리하기" class="w-full" />
                        </Motion>
                        <Motion
                            as="div"
                            :initial="{ opacity: 0, y: 12 }"
                            :animate="pageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }"
                            :transition="{ duration: 0.35, delay: 0.06 }"
                        >
                            <UTextarea
                                v-model="description"
                                label="설명"
                                placeholder="예: 공부한 내용을 3줄 이상 정리해서 제출"
                                :rows="11"
                                class="w-full md:flex-1"
                            />
                        </Motion>
                    </div>

                    <Motion
                        as="div"
                        class="min-w-0 rounded-3xl border border-default bg-accented/20 p-4 shadow-sm space-y-3 md:min-h-full"
                        :initial="{ opacity: 0, y: 12 }"
                        :animate="pageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }"
                        :transition="{ duration: 0.35, delay: 0.08 }"
                    >
                        <UInput v-model="reward" type="number" label="보상 포인트" placeholder="예: 100" class="w-full" />
                        <div class="flex items-start gap-2 rounded-2xl border border-default bg-default/65 px-4 py-2.5">
                            <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            <p class="text-ui-p3 leading-5 light:text-black/45 dark:text-white/45">
                                퀘스트를 끝냈을 때 학생에게 줄 포인트예요.
                            </p>
                        </div>
                        <UInput v-model="end_date" type="date" label="마감일" placeholder="예: 2026-06-30" class="w-full" />
                        <div class="flex items-start gap-2 rounded-2xl border border-default bg-default/65 px-4 py-2.5">
                            <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                            <p class="text-ui-p3 leading-5 light:text-black/45 dark:text-white/45">
                                이 날짜가 지나면 퀘스트는 자동으로 종료돼요.
                            </p>
                        </div>
                        <UButton color="primary" class="w-full justify-center" :loading="isLoading" @click="create">
                            퀘스트 등록
                        </UButton>
                        <p class="text-sm text-green-600" v-if="successMessage">{{ successMessage }}</p>
                    </Motion>
                </div>
            </Section>

            <Section name="등록된 퀘스트">
                <div class="space-y-3">
                    <template v-if="isLoading">
                        <div class="space-y-3 rounded-3xl border border-default bg-default/80 p-4">
                            <div class="h-4 w-28 animate-pulse rounded-full bg-default/70" />
                            <div class="h-4 w-3/5 animate-pulse rounded-full bg-default/70" />
                            <div class="h-4 w-4/5 animate-pulse rounded-full bg-default/70" />
                            <div class="mt-5 grid gap-3 sm:grid-cols-3">
                                <div class="h-20 animate-pulse rounded-2xl bg-default/70" />
                                <div class="h-20 animate-pulse rounded-2xl bg-default/70" />
                                <div class="h-20 animate-pulse rounded-2xl bg-default/70" />
                            </div>
                            <p class="text-ui-p2 light:text-black/50 dark:text-white/50">퀘스트를 불러오는 중...</p>
                        </div>
                    </template>
                    <template v-else-if="quests.length === 0">
                        <Motion
                            as="div"
                            class="rounded-3xl border border-default bg-default/80 p-4 text-ui-p2 light:text-black/50 dark:text-white/50"
                            :initial="{ opacity: 0, y: 10 }"
                            :animate="pageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }"
                            :transition="{ duration: 0.3 }"
                        >
                            등록된 퀘스트가 없어요.
                        </Motion>
                    </template>
                    <Motion
                        as="article"
                        v-for="(quest, index) in quests"
                        :key="quest.id ?? `quest-${index}`"
                        class="rounded-3xl border border-default bg-default/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        :initial="{ opacity: 0, y: 18, scale: 0.985 }"
                        :animate="pageReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.985 }"
                        :transition="{ duration: 0.35, delay: index * 0.06, ease: [0, 0.71, 0.2, 1.01] }"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <p class="text-p0 font-bold leading-tight">{{ quest.title }}</p>
                                    <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                        {{ quest.reward }} P
                                    </span>
                                </div>
                                <p class="mt-3 text-ui-p2 leading-6">{{ quest.description }}</p>
                            </div>
                            <UButton color="error" variant="soft" size="sm" @click="askRemove(quest.id, quest.title)">삭제</UButton>
                        </div>
                        <div class="mt-5 grid gap-3 sm:grid-cols-3">
                            <div class="rounded-2xl border border-default bg-accented/25 px-4 py-3">
                                <p class="text-ui-p3 light:text-black/40 dark:text-white/40">보상 미리보기</p>
                                <p class="mt-1 text-p1 font-semibold">{{ quest.reward.toLocaleString() }} P</p>
                            </div>
                            <div class="rounded-2xl border border-default bg-accented/25 px-4 py-3">
                                <p class="text-ui-p3 light:text-black/40 dark:text-white/40">마감 정보</p>
                                <p class="mt-1 text-p1 font-semibold">{{ getDeadlineText(quest.end_date) }}</p>
                            </div>
                            <div class="rounded-2xl border border-default bg-accented/25 px-4 py-3">
                                <p class="text-ui-p3 light:text-black/40 dark:text-white/40">운영 방식</p>
                                <p class="mt-1 text-p1 font-semibold">단일 진행</p>
                            </div>
                        </div>
                        <div class="mt-3 flex flex-wrap items-center gap-2">
                            <span
                                class="rounded-full px-3 py-1.5 text-ui-p3"
                                :class="isExpired(quest.end_date) ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600'"
                            >
                                {{ isExpired(quest.end_date) ? '마감됨' : '진행 중' }}
                            </span>
                            <span class="rounded-full bg-default px-3 py-1.5 text-ui-p3 light:text-black/70 dark:text-white/70">
                                실제 마감일 {{ formatDate(quest.end_date) }}
                            </span>
                        </div>
                    </Motion>
                </div>
            </Section>
        </div>

        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="deleteModalOpen"
                    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
                    @click.self="deleteModalOpen = false"
                >
                    <Motion
                        as="div"
                        class="w-full max-w-md overflow-hidden rounded-3xl border border-default bg-default shadow-2xl"
                        :initial="{ opacity: 0, y: 22, scale: 0.96 }"
                        :animate="{ opacity: 1, y: 0, scale: 1 }"
                        :transition="{ duration: 0.25, ease: [0, 0.71, 0.2, 1.01] }"
                    >
                        <div class="border-b border-default bg-linear-to-r from-red-500/10 to-transparent px-6 py-5">
                            <p class="text-ui-p3 uppercase tracking-[0.24em] light:text-black/40 dark:text-white/40">Delete Quest</p>
                            <h3 class="mt-1 text-h5 font-bold text-gray-900 dark:text-white">퀘스트를 삭제할까요?</h3>
                        </div>

                        <div class="space-y-4 px-6 py-5">
                            <p class="text-ui-p2 light:text-black/55 dark:text-white/55">
                                <span class="font-semibold text-gray-900 dark:text-white">{{ targetQuest?.title }}</span>
                                퀘스트를 정말 삭제할지 확인해 주세요.
                            </p>
                            <div class="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                                삭제하면 복구할 수 없어요.
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 border-t border-default px-6 py-4">
                            <UButton color="neutral" variant="soft" @click="deleteModalOpen = false">
                                취소
                            </UButton>
                            <UButton color="error" @click="remove">
                                삭제
                            </UButton>
                        </div>
                    </Motion>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
