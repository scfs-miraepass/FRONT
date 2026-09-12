<script setup lang="ts">
import type { KaraokeFinalBidResponse, KaraokePartyDetail, KaraokeResponse } from "@/client";
import { KaraokeStatus } from "@/client";
import { karaokeTimeLabel, karaokeStatusLabel, calcDutchPay } from "@/utils/karaoke";

definePageMeta({
    permissions: [UserPermission.VIEW_KARAOKE] as PermissionCondition,
});

const route = useRoute();
const toast = useToast();
const session = useSession();
const karaokeId = computed(() => Number(route.params.id));

const errorMessage = (err: unknown, fallback = "요청을 처리하지 못했어요.") =>
    err && typeof err === "object" && "message" in err ? String((err as any).message) : fallback;

const detail = ref<KaraokeResponse | null>(null);
const detailPending = ref<boolean>(true);
const finalBid = ref<KaraokeFinalBidResponse | null>(null);
const party = ref<KaraokePartyDetail | null>(null);
const partyPending = ref<boolean>(true);

const fetchDetail = async () => {
    const req = await $API.getKaraoke({ path: { karaoke_id: karaokeId.value } });
    if (req.error) return false;
    detail.value = req.data.data;
    return true;
};

const fetchFinalBid = async () => {
    const req = await $API.getKaraokeFinalBid({ path: { karaoke_id: karaokeId.value } });
    finalBid.value = req.error ? null : req.data.data;
};

const fetchParty = async () => {
    partyPending.value = true;
    const req = await $API.getMyKaraokeParty({ path: { karaoke_id: karaokeId.value } });
    party.value = req.error ? null : req.data.data;
    partyPending.value = false;
};

detailPending.value = true;
await fetchDetail();
detailPending.value = false;
if (detail.value?.status === KaraokeStatus.CONFIRMED) await fetchFinalBid();
if (hasPermission(session.value?.permissions, UserPermission.JOIN_KARAOKE)) await fetchParty();
else partyPending.value = false;

// 소켓은 마감된 경매에는 연결하지 않는다 (7장: WS는 상태와 무관하게 동작하지만 마감 후엔 final-bid를 사용).
const socketEnabled = computed(() => detail.value?.status !== KaraokeStatus.CONFIRMED);
const { state, remainingTime } = useKaraokeSocket(karaokeId, socketEnabled);

// 스케줄러가 최대 30초 지연되므로, 종료 시각이 지나면 상태가 바뀔 때까지 짧게 폴링한다.
let settleInterval: ReturnType<typeof setInterval> | undefined;
watch(remainingTime, (value) => {
    if (value > 0 || detail.value?.status !== KaraokeStatus.IN_PROGRESS || settleInterval) return;
    settleInterval = setInterval(async () => {
        const ok = await fetchDetail();
        if (ok && detail.value?.status === KaraokeStatus.CONFIRMED) {
            clearInterval(settleInterval);
            settleInterval = undefined;
            await fetchFinalBid();
        }
    }, 4000);
});
onScopeDispose(() => clearInterval(settleInterval));

// Pending 상태의 "시작까지 남은 시간"은 로컬에서 계산한다 (WS의 remaining_time은 종료 시각 기준이라 그대로 쓸 수 없음).
const now = ref<number>(Date.now());
const nowTicker = import.meta.client ? setInterval(() => (now.value = Date.now()), 1000) : undefined;
onScopeDispose(() => clearInterval(nowTicker));

const secondsUntilStart = computed(() => {
    if (!detail.value) return 0;
    return Math.max(0, Math.floor((new Date(detail.value.start_time).getTime() - now.value) / 1000));
});

const formatDuration = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const highestAmount = computed(() => state.value?.highest_bid?.amount ?? detail.value?.highest_bid ?? null);
const bidsHistory = computed(() => state.value?.bids_history ?? []);
const minBid = computed(() => (highestAmount.value != null ? highestAmount.value + 1 : (detail.value?.min_point ?? 0)));

const isLeader = computed(() => !!party.value && party.value.leader_id === session.value?.id);
const isMember = computed(() => !!party.value && !isLeader.value);
const partyHeadcount = computed(() => (isLeader.value ? 1 + (party.value?.members.length ?? 0) : 1));

const bidAmount = ref<number>(0);
const bidding = ref<boolean>(false);
const creatingParty = ref<boolean>(false);

watch(
    minBid,
    (value) => {
        if (bidAmount.value < value) bidAmount.value = value;
    },
    { immediate: true },
);

const dutchPreview = computed(() =>
    isLeader.value && partyHeadcount.value > 1 ? calcDutchPay(bidAmount.value, partyHeadcount.value) : null,
);

const canBid = computed(() => detail.value?.status === KaraokeStatus.IN_PROGRESS && !isMember.value);

const submitBid = async () => {
    if (bidAmount.value < minBid.value) return;
    bidding.value = true;
    const req = await $API.createKaraokeBid({
        path: { karaoke_id: karaokeId.value },
        body: { amount: bidAmount.value },
    });
    bidding.value = false;

    if (req.error) {
        toast.add({ title: "입찰에 실패했어요.", description: errorMessage(req.error), color: "error" });
        await fetchDetail();
        return;
    }

    toast.add({ title: "입찰했어요!", color: "success" });
    await fetchSession();
};

const createParty = async () => {
    creatingParty.value = true;
    const req = await $API.createKaraokeParty({ path: { karaoke_id: karaokeId.value } });
    creatingParty.value = false;

    if (req.error) {
        toast.add({ title: "파티를 만들지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }
    await fetchParty();
    navigateTo(`/karaoke/${karaokeId.value}/party`);
};

const dateTimeLabel = computed(() => {
    if (!detail.value) return "";
    const d = new Date(detail.value.date);
    return `${d.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} ${karaokeTimeLabel(detail.value.time)}`;
});
</script>

<template>
    <div class="flex items-center mb-4">
        <NuxtLink to="/karaoke" v-slot="{ navigate }" custom>
            <UButton
                @click="navigate()"
                color="neutral"
                variant="ghost"
                icon="i-ph-caret-left-bold"
                class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented"
                size="xl"
            />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">{{ dateTimeLabel }}</p>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50" v-if="detailPending">
        <UIcon name="i-ph-spinner-gap" class="text-h2 mb-1.5 animate-spin" />
        불러오는 중..
    </div>

    <div class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50" v-else-if="!detail">
        <UIcon name="i-ph-smiley-sad-thin" class="text-h2 mb-1.5" />
        경매를 찾지 못했어요.
    </div>

    <div class="flex-1 flex flex-col gap-3" v-else>
        <!-- 마감된 경매: 최종 낙찰 정보만 표시 -->
        <div class="rounded-2xl light:bg-default dark:bg-muted p-5 flex flex-col items-center" v-if="detail.status === KaraokeStatus.CONFIRMED">
            <UBadge color="neutral" variant="subtle" class="rounded-full mb-3">마감됨</UBadge>
            <template v-if="finalBid">
                <UIcon name="i-ph-crown-simple-fill" class="text-h4 mb-2" />
                <p class="text-p1 font-bold">
                    {{ finalBid.bidder.name }}{{ finalBid.bidder.number ? ` (${finalBid.bidder.grade}학년 ${finalBid.bidder.number}반)` : "" }}
                </p>
                <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-1">
                    {{ finalBid.amount.toLocaleString() }}P에 낙찰
                    <template v-if="finalBid.party_id">(파티)</template>
                </p>
            </template>
            <p class="text-ui-p1 opacity-50 mt-2" v-else>입찰 기록이 없어 낙찰자가 없어요.</p>
        </div>

        <!-- 진행중 / 예정: 실시간 경매 화면 -->
        <template v-else>
            <div class="rounded-2xl light:bg-default dark:bg-muted p-5 flex flex-col items-center">
                <UBadge
                    :color="detail.status === KaraokeStatus.IN_PROGRESS ? 'primary' : 'warning'"
                    variant="subtle"
                    class="rounded-full mb-3"
                >
                    {{ karaokeStatusLabel(detail.status) }}
                </UBadge>

                <template v-if="detail.status === KaraokeStatus.PENDING">
                    <p class="text-ui-p2 light:text-black/50 dark:text-white/50">시작까지</p>
                    <p class="text-h5 font-bold my-1">{{ formatDuration(secondsUntilStart) }}</p>
                    <p class="text-ui-p2 light:text-black/50 dark:text-white/50">
                        최소 입찰가 {{ (detail.min_point ?? 0).toLocaleString() }}P
                    </p>
                </template>
                <template v-else>
                    <p class="text-ui-p2 light:text-black/50 dark:text-white/50">종료까지</p>
                    <p class="text-h5 font-bold my-1">{{ formatDuration(remainingTime) }}</p>
                    <div class="flex items-center gap-1.5 text-p1 font-bold">
                        <UIcon name="i-ph-crown-simple-fill" v-if="highestAmount != null" />
                        <template v-if="highestAmount != null">{{ highestAmount.toLocaleString() }}P</template>
                        <template v-else>입찰 없음</template>
                    </div>
                    <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-0.5" v-if="state?.highest_bid">
                        {{ state.highest_bid.bidder_id === session?.id ? "나" : `학번 ${state.highest_bid.bidder_id}` }}
                        {{ state.highest_bid.party_id ? "(파티)" : "" }} 최고가
                    </p>
                </template>
            </div>

            <!-- 파티 상태 -->
            <div class="rounded-2xl light:bg-default dark:bg-muted p-4" v-if="!partyPending">
                <div v-if="!party" class="flex items-center justify-between gap-2">
                    <p class="text-p2 light:text-black/60 dark:text-white/60">혼자 입찰하거나, 파티를 만들어 함께 낼 수 있어요.</p>
                    <UButton size="sm" class="rounded-xl shrink-0" :loading="creatingParty" @click="createParty">파티 만들기</UButton>
                </div>
                <div v-else class="flex items-center justify-between gap-2">
                    <div class="flex flex-col">
                        <p class="text-p2 font-bold">
                            {{ isLeader ? `내 파티 (${partyHeadcount}명)` : `${party.leader.name}님의 파티` }}
                        </p>
                        <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-0.5" v-if="!isLeader">
                            파티장만 입찰할 수 있어요.
                        </p>
                        <p
                            class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-0.5"
                            v-else-if="dutchPreview"
                        >
                            1인당 {{ dutchPreview.perMember.toLocaleString() }}P (나 {{ dutchPreview.leaderShare.toLocaleString() }}P)
                        </p>
                    </div>
                    <NuxtLink :to="`/karaoke/${karaokeId}/party`" v-slot="{ navigate }" custom>
                        <UButton size="sm" color="neutral" variant="soft" class="rounded-xl shrink-0" @click="navigate()">
                            파티 관리
                        </UButton>
                    </NuxtLink>
                </div>
            </div>

            <!-- 입찰 폼 -->
            <div class="rounded-2xl light:bg-default dark:bg-muted p-4" v-if="canBid">
                <UFormField :label="`최소 ${minBid.toLocaleString()}P 이상`" class="w-full">
                    <div class="flex gap-2">
                        <UInput
                            type="number"
                            :min="minBid"
                            step="100"
                            size="xl"
                            class="flex-1"
                            v-model.number="bidAmount"
                        />
                        <UButton
                            size="xl"
                            class="rounded-xl shrink-0"
                            :disabled="bidAmount < minBid"
                            :loading="bidding"
                            @click="submitBid"
                        >
                            입찰하기
                        </UButton>
                    </div>
                </UFormField>
            </div>
            <p class="text-ui-p2 text-center opacity-50" v-else-if="detail.status === KaraokeStatus.IN_PROGRESS && isMember">
                파티장만 입찰할 수 있어요.
            </p>

            <!-- 입찰 기록 -->
            <div class="flex-1 rounded-2xl light:bg-default dark:bg-muted p-1 py-2.5 flex flex-col overflow-y-auto" v-if="detail.status === KaraokeStatus.IN_PROGRESS">
                <p class="text-ui-p2 light:text-black/50 dark:text-white/50 px-4 pb-1.5">입찰 기록</p>
                <div class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50 py-6" v-if="bidsHistory.length <= 0">
                    아직 입찰이 없어요.
                </div>
                <div
                    v-else
                    v-for="bid in bidsHistory"
                    :key="bid.id ?? bid.created_at?.toString()"
                    class="flex items-center justify-between px-4 py-2"
                >
                    <p class="text-p2">
                        {{ bid.bidder_id === session?.id ? "나" : `학번 ${bid.bidder_id}` }}
                        <span class="opacity-50" v-if="bid.party_id">(파티)</span>
                    </p>
                    <p class="text-p2 font-bold">{{ bid.amount.toLocaleString() }}P</p>
                </div>
            </div>
        </template>
    </div>
</template>
