<script setup lang="ts">
import type { KaraokeResponse } from "@/client";
import { toDateInputValue } from "@/utils/karaoke";
import KaraokeHeader from "~/components/karaoke/header.vue";
import DateNav from "~/components/karaoke/list/dateNav.vue";
import KaraokeList from "~/components/karaoke/list/list.vue";

definePageMeta({
    permissions: [UserPermission.VIEW_KARAOKE] as PermissionCondition,
});

const session = useSession();
const selectedDate = ref<string>(toDateInputValue(new Date()));
const inviteCount = ref<number>(0);

const fetchKaraokeList = async () => {
    // 생성된 SDK 타입은 date 필드를 Date로 표기하지만, 요청 검증기는 "YYYY-MM-DD" 문자열을 기대한다.
    const req = await $API.getKaraokeList({ query: { date: selectedDate.value as unknown as Date } });
    if (req.error || !req.data) return [];
    return req.data.data;
};

const { data: karaokeList, pending } = await useAsyncData<KaraokeResponse[]>(
    "karaoke.list",
    fetchKaraokeList,
    { watch: [selectedDate], default: () => [] },
);

// 예정(Pending) 경매의 시작 시간, 진행중(In_Progress) 경매의 종료 시간이 지나면
// 서버 상태가 갱신될 때까지 잠시 후 목록을 다시 불러와 화면을 최신 상태로 맞춘다.
const now = ref<number>(Date.now());
const hasStaleStatus = computed(() =>
    (karaokeList.value ?? []).some((item) => {
        if (item.status === "Pending") return new Date(item.start_time).getTime() <= now.value;
        if (item.status === "In_Progress") return new Date(item.end_time).getTime() <= now.value;
        return false;
    }),
);

if (import.meta.client) {
    const nowTicker = setInterval(() => (now.value = Date.now()), 1000);
    let staleRetryInterval: ReturnType<typeof setInterval> | undefined;

    watch(
        hasStaleStatus,
        async (stale) => {
            if (!stale) {
                if (staleRetryInterval) {
                    clearInterval(staleRetryInterval);
                    staleRetryInterval = undefined;
                }
                return;
            }
            if (staleRetryInterval) return;
            staleRetryInterval = setInterval(async () => {
                karaokeList.value = await fetchKaraokeList();
            }, 3000);
        },
        { immediate: true },
    );

    onUnmounted(() => {
        clearInterval(nowTicker);
        if (staleRetryInterval) clearInterval(staleRetryInterval);
    });
}

if (import.meta.client && hasPermission(session.value?.permissions, UserPermission.JOIN_KARAOKE)) {
    const req = await $API.getMyKaraokePartyInvites();
    if (!req.error && req.data) inviteCount.value = req.data.data.filter((i) => i.pending).length;
}

const onCardClick = (item: KaraokeResponse) => {
    navigateTo(`/karaoke/${item.id}`);
};
</script>

<template>
    <!-- 상단 헤더: 뒤로가기 + 제목 + 초대함 버튼 -->
    <KaraokeHeader to="/" title="노래방 예약">
        <NuxtLink
            to="/karaoke/invites"
            v-slot="{ navigate }"
            custom
            v-if="hasPermission(session?.permissions, UserPermission.JOIN_KARAOKE)"
        >
            <UButton
                @click="navigate()"
                color="neutral"
                variant="ghost"
                icon="i-ph-bell-fill"
                class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented relative"
                size="xl"
            >
                <span
                    v-if="inviteCount > 0"
                    class="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-error text-white text-[10px] flex items-center justify-center"
                >
                    {{ inviteCount }}
                </span>
            </UButton>
        </NuxtLink>
    </KaraokeHeader>

    <!-- 날짜 네비게이션: 이전/다음 날짜 이동 + 날짜 선택 -->
    <DateNav v-model:date="selectedDate" />

    <!-- 경매 목록: 로딩/빈 상태 및 카드 목록 -->
    <KaraokeList :items="karaokeList" :pending="pending" @select="onCardClick" />
</template>
