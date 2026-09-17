<script setup lang="ts">
import type { KaraokeFinalBidResponse } from "@/client";

defineProps<{
    finalBid: KaraokeFinalBidResponse | null;
}>();
</script>

<template>
    <div class="rounded-2xl light:bg-default dark:bg-muted p-5 flex flex-col items-center">
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
</template>
