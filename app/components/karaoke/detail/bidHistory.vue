<script setup lang="ts">
import type { KaraokeBids } from "@/client";

defineProps<{
    bids: KaraokeBids[];
    sessionId: number | null | undefined;
}>();
</script>

<template>
    <div class="flex-1 rounded-2xl light:bg-default dark:bg-muted p-4 flex flex-col overflow-y-auto">
        <p class="text-ui-p2 light:text-black/50 dark:text-white/50">입찰 기록</p>
        <div class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50 py-6" v-if="bids.length <= 0">
            아직 입찰이 없어요.
        </div>
        <div
            v-else
            v-for="bid in bids"
            :key="bid.id ?? bid.created_at?.toString()"
            class="flex items-center justify-between px-4 py-2"
        >
            <p class="text-p2">
                {{ bid.bidder_id === sessionId ? "나" : `학번 ${bid.bidder_id}` }}
                <span class="opacity-50" v-if="bid.party_id">(파티)</span>
            </p>
            <p class="text-p2 font-bold">{{ bid.amount.toLocaleString() }}P</p>
        </div>
    </div>
</template>
