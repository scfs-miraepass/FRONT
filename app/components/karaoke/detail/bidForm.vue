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
    <div class="rounded-2xl light:bg-default dark:bg-muted p-6 flex flex-col gap-2">
        <UFormField :label="`최소 ${minBid.toLocaleString()}P 이상 · 100P 단위`" class="w-full">
            <UInputNumber
                v-model="amount"
                :min="minBid"
                :step="KARAOKE_BID_UNIT"
                size="xl"
                class="w-full"
                :ui="{ base: 'text-center' }"
            />
        </UFormField>
        <UButton
            size="xl"
            class="rounded-lg w-full justify-center"
            :disabled="!isValid"
            :loading="bidding"
            @click="$emit('submit')"
        >
            입찰하기
        </UButton>
    </div>
</template>
