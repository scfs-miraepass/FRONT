<script setup lang="ts">
import type { KaraokeBids } from "@/client";
import { KaraokeStatus } from "@/client";
import { karaokeStatusLabel, formatDuration } from "@/utils/karaoke";

defineProps<{
    status: KaraokeStatus | undefined;
    remainingTime: number;
    minPoint: number;
    highestAmount: number | null;
    highestBid: KaraokeBids | null | undefined;
    sessionId: number | null | undefined;
}>();
</script>

<template>
    <div class="rounded-2xl light:bg-default dark:bg-muted p-5 flex flex-col items-center">
        <UBadge
            :color="status === KaraokeStatus.IN_PROGRESS ? 'primary' : 'warning'"
            variant="subtle"
            class="rounded-full mb-3"
        >
            {{ karaokeStatusLabel(status) }}
        </UBadge>

        <template v-if="status === KaraokeStatus.PENDING">
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50">시작까지</p>
            <p class="text-h5 font-bold my-1">{{ formatDuration(remainingTime) }}</p>
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50">
                최소 입찰가 {{ minPoint.toLocaleString() }}P
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
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-0.5" v-if="highestBid">
                {{ highestBid.bidder_id === sessionId ? "나" : `학번 ${highestBid.bidder_id}` }}
                {{ highestBid.party_id ? "(파티)" : "" }} 최고가
            </p>
        </template>
    </div>
</template>
