<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import type { QuestResponse } from "@/sdk";
import { useQuest } from "@/composables/useQuest";
const session = useSession();

const props = defineProps<QuestResponse & { accepted?: boolean }>()

const formattedEndDate = computed(() => {
    try {
        return new Date(props.end_date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    } catch {
        return props.end_date
    }
})

const { acceptQuest, fetchAcceptedStudents, hasAccepted, cancelAccept } = useQuest();
const acceptedList = ref<Array<{ id: number; name: string; grade?: number; number?: number }>>([]);
const showAccepted = ref(false);
const loadingAccepted = ref(false);
const accepted = ref(false);
const checkingAccepted = ref(false);

const onAccept = async () => {
    if (!props.id) return;
    const ok = await acceptQuest(props.id);
    if (ok) {
        const toast = useToast();
        toast.add({ description: '퀘스트를 수락했습니다.', color: 'success' });
        accepted.value = true;
    }
};

const onCancel = async () => {
    if (!props.id) return;
    const ok = await cancelAccept(props.id);
    if (ok) {
        const toast = useToast();
        toast.add({ description: '퀘스트 수락을 취소했습니다.', color: 'info' });
        accepted.value = false;
    }
};

const toggleAccepted = async () => {
    if (!props.id) return;
    showAccepted.value = !showAccepted.value;
    if (showAccepted.value) {
        loadingAccepted.value = true;
        const res = await fetchAcceptedStudents(props.id);
        loadingAccepted.value = false;
        acceptedList.value = res ?? [];
    }
};

const checkAcceptedIfNeeded = async () => {
    if (!props.id) return;
    if (props.accepted !== undefined) {
        accepted.value = !!props.accepted;
        return;
    }
    if (session?.type !== 'student') return;
    checkingAccepted.value = true;
    const res = await hasAccepted(props.id);
    accepted.value = !!res;
    checkingAccepted.value = false;
};

onMounted(() => {
    void checkAcceptedIfNeeded();
});

watch([
    () => session && (session as any).id,
    () => props.id,
], () => {
    void checkAcceptedIfNeeded();
});
</script>

<template>
    <div
        role="button"
        tabindex="0"
        class="w-full rounded-3xl border border-default bg-default p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md text-left"
    >
        <div class="flex items-start justify-between gap-4">
            <div class="space-y-2 text-left">
                <p class="text-ui-p3 uppercase tracking-[0.24em] text-primary">퀘스트</p>
                <p class="text-h5 font-bold light:text-black dark:text-white">{{ props.title }}</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="rounded-2xl bg-primary/10 px-3 py-2 text-primary font-semibold">
                    +{{ props.reward }}P
                </div>
                <template v-if="session?.type === 'student'">
                    <template v-if="accepted">
                        <span class="rounded-full bg-success/10 text-success px-2 py-1 text-sm font-medium">수락됨</span>
                        <UButton size="sm" color="danger" variant="outline" class="ml-2" @click.stop="onCancel">취소</UButton>
                    </template>
                    <template v-else>
                        <UButton size="sm" color="primary" variant="outline" @click.stop="onAccept" :loading="checkingAccepted">수락</UButton>
                    </template>
                </template>
                <template v-else-if="(session?.type === 'teacher' || session?.is_admin) && (session?.id === props.author_id || session?.is_admin)">
                    <UButton size="sm" color="neutral" variant="ghost" @click.stop="toggleAccepted">수락자 보기</UButton>
                </template>
            </div>
        </div>

        <p class="mt-4 text-sm leading-6 text-black/70 dark:text-white/70">
            {{ props.description }}
        </p>

        <div v-if="showAccepted" class="mt-3">
            <div v-if="loadingAccepted" class="text-sm text-black/50">로딩 중...</div>
            <ul v-else class="space-y-2 text-sm text-black/70">
                <li v-for="u in acceptedList" :key="u.id">{{ u.name }} <span v-if="u.grade"> ({{ u.grade }}학년 {{ u.number }}반)</span></li>
                <li v-if="acceptedList.length === 0" class="text-black/40">수락한 학생이 없습니다.</li>
            </ul>
        </div>

        <div class="mt-5 flex items-center justify-between gap-3 text-sm text-black/50 dark:text-white/50">
            <span>종료일: {{ formattedEndDate }}</span>
            <span class="rounded-full border border-default/70 px-3 py-1">퀘스트</span>
        </div>
    </div>
</template>
