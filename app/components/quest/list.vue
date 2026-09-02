<script setup lang="ts">
import { onMounted, watch } from 'vue';
import Obj from "@/components/quest/object.vue";
import { useQuest } from "@/composables/useQuest";
import { useSession } from "@/composables/useSession";

const { quests, fetchQuests, isLoading, hasAccepted } = useQuest()
const session = useSession()

const runChecks = async () => {
    if (!session.value || session.value.type !== 'student') return;
    const checks = await Promise.all(quests.value.map((q) => hasAccepted(q.id)));
    checks.forEach((val, idx) => {
        (quests.value[idx] as any).accepted = !!val;
    });
}

onMounted(async () => {
    await fetchQuests()
    await runChecks()
})

watch(
    () => session.value,
    (nv) => {
        if (nv && nv.type === 'student') {
            void runChecks();
        }
    }
)
</script>

<template>
    <Motion
            as="div"
            class="gap-4 relative overflow-hidden rounded-3xl border border-default bg-linear-to-br from-primary/10 via-default to-default p-5 shadow-sm mb-5"
            :initial="{ opacity: 0, y: 14, scale: 0.99 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{ duration: 0.45, ease: [0, 0.71, 0.2, 1.01] }"
        >
            <div class="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
            <div class="relative flex flex-col gap-2">
                <p class="text-ui-p3 uppercase tracking-[0.28em] light:text-black/40 dark:text-white/40">Quest List</p>
                <p class="text-p1 light:text-black/70 dark:text-white/70">등록된 모든 퀘스트를 확인하고 관리하세요.</p>
            </div>
    </Motion>

    <div class="mx-auto w-full max-w-6xl space-y-6">
        <div class="grid gap-4">
            <Obj
                v-for="quest in quests"
                :key="quest.id"
                v-bind="quest"
            />
        </div>

        <div
            v-if="!isLoading && quests.length <= 0"
            class="flex flex-col items-center justify-center rounded-3xl border border-default bg-default p-10 opacity-70"
        >
            <UIcon
                name="i-ph-list-checks"
                class="text-h2 mb-2"
            />
            <p class="text-ui-p0">등록된 퀘스트가 없습니다.</p>
        </div>
    </div>
</template>
