<script setup lang="ts">
import { KARAOKE_BID_UNIT } from "@/utils/karaoke";

const amount = defineModel<number>("amount", { required: true });
defineProps<{
    minBid: number;
    isValid: boolean;
    bidding: boolean;
}>();
defineEmits<{ submit: [] }>();
</script>

<template>
    <div class="flex-1 rounded-2xl light:bg-default dark:bg-muted p-6 flex flex-col">
<!--        <UInputNumber-->
<!--            v-model="amount"-->
<!--            :min="minBid"-->
<!--            :step="KARAOKE_BID_UNIT"-->
<!--            size="xl"-->
<!--            class="w-full"-->
<!--            :ui="{ base: 'text-center' }"-->
<!--        />-->
<!--        <UButton-->
<!--            size="xl"-->
<!--            class="rounded-lg w-full justify-center"-->
<!--            :disabled="!isValid"-->
<!--            :loading="bidding"-->
<!--            @click="$emit('submit')"-->
<!--        >-->
<!--            입찰하기-->
<!--        </UButton>-->
        <div class="flex flex-col items-center flex-1 justify-center">
            <div class="flex items-center">
                <span class="text-h2 font-bold">{{amount.toLocaleString() }}</span>
                <span class="text-h4">P</span>
            </div>
            <p
                class="text-ui-p2 mt-2 px-3 py-1.5 rounded-xl dark:bg-muted light:text-black/45 dark:text-white/40"
                ref="pointScope"
            >
                <!-- TODO: 현재 입찰할 수 있는 최대 금액 표기 되도록 해야함 -->
            </p>
        </div>


        <p class="text-ui-p2 light:text-black/50 dark:text-white/50 text-center mb-4">{{ minBid.toLocaleString() }}P 이상 입찰할 수 있어요</p>
        <UButton
            class="rounded-2xl justify-center flex py-4.5 transition-opacity mt-auto"
        >
            <p class="text-p0">
                입찰하기
            </p>
        </UButton>
    </div>
</template>
