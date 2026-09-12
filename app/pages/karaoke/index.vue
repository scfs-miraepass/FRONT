<script setup lang="ts">
import type { KaraokeResponse } from "@/client";
import { karaokeTimeLabel, karaokeStatusLabel, toDateInputValue, addDays } from "@/utils/karaoke";

definePageMeta({
    permissions: [UserPermission.VIEW_KARAOKE] as PermissionCondition,
});

const session = useSession();
const dateInput = ref<HTMLInputElement>();
const selectedDate = ref<string>(toDateInputValue(new Date()));
const inviteCount = ref<number>(0);

const isToday = computed(() => selectedDate.value === toDateInputValue(new Date()));
const dateLabel = computed(() => {
    const d = new Date(`${selectedDate.value}T00:00:00`);
    return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
});

const moveDate = (days: number) => {
    selectedDate.value = toDateInputValue(addDays(new Date(`${selectedDate.value}T00:00:00`), days));
};

const { data: karaokeList, pending } = await useAsyncData<KaraokeResponse[]>(
    "karaoke.list",
    async () => {
        // 생성된 SDK 타입은 date 필드를 Date로 표기하지만, 요청 검증기는 "YYYY-MM-DD" 문자열을 기대한다.
        const req = await $API.getKaraokeList({ query: { date: selectedDate.value as unknown as Date } });
        if (req.error || !req.data) return [];
        return req.data.data;
    },
    { watch: [selectedDate], default: () => [] },
);

if (import.meta.client && hasPermission(session.value?.permissions, UserPermission.JOIN_KARAOKE)) {
    const req = await $API.getMyKaraokePartyInvites();
    if (!req.error && req.data) inviteCount.value = req.data.data.filter((i) => i.pending).length;
}

const onCardClick = (item: KaraokeResponse) => {
    navigateTo(`/karaoke/${item.id}`);
};
</script>

<template>
    <div class="flex items-center mb-4">
        <NuxtLink to="/" v-slot="{ navigate }" custom>
            <UButton
                @click="navigate()"
                color="neutral"
                variant="ghost"
                icon="i-ph-caret-left-bold"
                class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented"
                size="xl"
            />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1 flex-1">노래방 예약</p>
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
    </div>

    <div class="flex items-center justify-between mb-3">
        <UButton
            @click="moveDate(-1)"
            color="neutral"
            variant="ghost"
            icon="i-ph-caret-left-bold"
            class="p-2 rounded-2xl hover:bg-accented active:bg-accented"
        />
        <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:bg-accented relative"
            @click="dateInput?.showPicker?.() ?? dateInput?.click()"
        >
            <p class="text-p1 font-bold">{{ dateLabel }}</p>
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50" v-if="isToday">오늘</p>
            <input
                type="date"
                ref="dateInput"
                v-model="selectedDate"
                class="absolute inset-0 opacity-0 pointer-events-none"
            />
        </button>
        <UButton
            @click="moveDate(1)"
            color="neutral"
            variant="ghost"
            icon="i-ph-caret-right-bold"
            class="p-2 rounded-2xl hover:bg-accented active:bg-accented"
        />
    </div>

    <div class="flex-1 flex flex-col gap-2">
        <template v-if="pending">
            <USkeleton v-for="i in 4" :key="i" class="w-full h-18 rounded-2xl" />
        </template>
        <div
            class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50 py-16"
            v-else-if="karaokeList.length <= 0"
        >
            <UIcon name="i-ph-calendar-blank" class="text-h2 mb-1.5" />
            이 날짜엔 예정된 경매가 없어요.
        </div>
        <button
            v-else
            v-for="item in karaokeList"
            :key="item.id!"
            class="w-full rounded-2xl light:bg-default dark:bg-muted px-5 py-4 flex items-center justify-between transition-all active:scale-95 active:opacity-70"
            @click="onCardClick(item)"
        >
            <div class="flex flex-col items-start">
                <p class="text-p1 font-bold">{{ karaokeTimeLabel(item.time) }}</p>
                <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-1">
                    {{ new Date(item.start_time).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) }}
                    ~
                    {{ new Date(item.end_time).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) }}
                </p>
            </div>
            <div class="flex flex-col items-end">
                <UBadge
                    :color="item.status === 'In_Progress' ? 'primary' : item.status === 'Confirmed' ? 'neutral' : 'warning'"
                    variant="subtle"
                    class="rounded-full"
                >
                    {{ karaokeStatusLabel(item.status) }}
                </UBadge>
                <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-1.5">
                    <template v-if="item.status === 'In_Progress' && item.highest_bid != null">
                        {{ item.highest_bid.toLocaleString() }}P
                    </template>
                    <template v-else-if="item.status === 'In_Progress'"> 입찰 없음 </template>
                    <template v-else-if="item.status === 'Confirmed'"> 마감됨 </template>
                    <template v-else> 시작 전 </template>
                </p>
            </div>
        </button>
    </div>
</template>
