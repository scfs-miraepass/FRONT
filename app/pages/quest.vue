<script setup lang="ts">
import { Motion } from "motion-v";
import type { UserType } from "@/sdk";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useSession } from "@/composables/useSession";
import { useQuest } from "@/composables/useQuest";

definePageMeta({
    permissions: ['student'] as UserType[],
});

const session = useSession();
const { quests, isLoading, error, fetchQuests, completeQuest } = useQuest();
const completed = ref<number | null>(null);
const pageReady = ref(false);
const animatedStats = ref({
    total: 0,
    active: 0,
    reward: 0,
});

const formatDate = (value: string) => new Date(value).toLocaleDateString();
const isExpired = (value: string) => new Date(value).getTime() < Date.now();

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

const onComplete = async (questId: number) => {
    const reward = await completeQuest(questId);
    if (reward !== null) {
        completed.value = questId;
    }
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
            <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">퀘스트 목록</p>
        </div>

        <div class="space-y-4">
            <Motion
                as="div"
                class="relative overflow-hidden rounded-3xl border border-default bg-linear-to-br from-primary/10 via-default to-default p-5 shadow-sm"
                :initial="{ opacity: 0, y: 14, scale: 0.99 }"
                :animate="pageReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.99 }"
                :transition="{ duration: 0.45, ease: [0, 0.71, 0.2, 1.01] }"
            >
                <div class="absolute -right-12 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                <div class="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div class="max-w-2xl space-y-2">
                        <p class="text-ui-p3 uppercase tracking-[0.28em] light:text-black/40 dark:text-white/40">Quest Board</p>
                        <h1 class="text-h4 font-bold text-gray-900 dark:text-white">학생 퀘스트</h1>
                        <p class="text-ui-p2 leading-6 light:text-black/55 dark:text-white/55">
                            완료 가능한 퀘스트를 한눈에 보고, 보상과 마감일을 바로 확인할 수 있어요.
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
                    class="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-500"
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="pageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }"
                    :transition="{ duration: 0.25 }"
                >
                    {{ error }}
                </Motion>
            </template>

            <template v-if="isLoading">
                <div class="space-y-3">
                    <div class="rounded-3xl border border-default bg-default/80 p-4">
                        <div class="h-4 w-28 animate-pulse rounded-full bg-default/70" />
                        <div class="mt-4 h-4 w-3/5 animate-pulse rounded-full bg-default/70" />
                        <div class="mt-3 h-4 w-4/5 animate-pulse rounded-full bg-default/70" />
                        <div class="mt-5 flex flex-wrap gap-2">
                            <div class="h-8 w-24 animate-pulse rounded-full bg-default/70" />
                            <div class="h-8 w-20 animate-pulse rounded-full bg-default/70" />
                            <div class="h-8 w-20 animate-pulse rounded-full bg-default/70" />
                        </div>
                    </div>
                    <p class="text-ui-p2 light:text-black/50 dark:text-white/50">퀘스트를 불러오는 중...</p>
                </div>
            </template>

            <template v-if="quests.length === 0 && !isLoading">
                <Motion
                    as="div"
                    class="rounded-3xl border border-default bg-default/80 p-6 text-ui-p2 light:text-black/50 dark:text-white/50"
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="pageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }"
                    :transition="{ duration: 0.3 }"
                >
                    현재 등록된 퀘스트가 없어요.
                </Motion>
            </template>

            <div class="grid gap-3">
                <Motion
                    as="article"
                    v-for="(quest, index) in quests"
                    :key="quest.id ?? `quest-${index}`"
                    class="rounded-3xl border border-default bg-default/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    :initial="{ opacity: 0, y: 18, scale: 0.985 }"
                    :animate="pageReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.985 }"
                    :transition="{ duration: 0.35, delay: index * 0.06, ease: [0, 0.71, 0.2, 1.01] }"
                >
                    <div class="flex flex-col gap-4">
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <p class="text-p0 font-bold leading-tight">{{ quest.title }}</p>
                                    <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                        {{ quest.reward }} P
                                    </span>
                                </div>
                                <p class="mt-2 text-ui-p2 leading-6">{{ quest.description }}</p>
                            </div>

                            <div class="shrink-0 text-right">
                                <p class="text-ui-p3 uppercase tracking-[0.2em] light:text-black/40 dark:text-white/40">마감</p>
                                <p class="mt-1 text-p1 font-semibold">{{ formatDate(quest.end_date) }}</p>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <span class="rounded-full bg-accented px-3 py-1.5 text-ui-p3 light:text-black/70 dark:text-white/70">
                                단일 진행
                            </span>
                            <span
                                class="rounded-full px-3 py-1.5 text-ui-p3"
                                :class="isExpired(quest.end_date) ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600'"
                            >
                                {{ isExpired(quest.end_date) ? '마감됨' : '진행 중' }}
                            </span>
                            <span
                                v-if="completed === quest.id"
                                class="rounded-full bg-primary/10 px-3 py-1.5 text-ui-p3 text-primary"
                            >
                                완료됨
                            </span>
                        </div>

                        <div class="flex items-center justify-between gap-3 border-t border-default/70 pt-4">
                            <p class="text-ui-p3 light:text-black/40 dark:text-white/40">
                                {{ session.value?.type === 'student' ? '학생 계정에서만 완료할 수 있어요.' : '읽기 전용 상태예요.' }}
                            </p>
                            <UButton
                                color="primary"
                                size="sm"
                                :disabled="session.value?.type !== 'student' || isExpired(quest.end_date) || completed === quest.id"
                                @click="onComplete(quest.id)"
                            >
                                {{ completed === quest.id ? '완료됨' : isExpired(quest.end_date) ? '기간 종료' : session.value?.type === 'student' ? '퀘스트 완료' : '보기' }}
                            </UButton>
                        </div>
                    </div>
                </Motion>
            </div>
        </div>
    </div>
</template>
