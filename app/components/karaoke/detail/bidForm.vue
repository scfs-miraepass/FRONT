<script setup lang="ts">
import { KARAOKE_BID_UNIT } from "@/utils/karaoke";

const amount = defineModel<number>("amount", { required: true });
const props = defineProps<{
    minBid: number;
    isValid: boolean;
    bidding: boolean;
}>();
defineEmits<{ submit: [] }>();

const decrease = () => {
    amount.value = Math.max(props.minBid, amount.value - KARAOKE_BID_UNIT);
};
const increase = () => {
    amount.value += KARAOKE_BID_UNIT;
};
const normalize = () => {
    if (!Number.isFinite(amount.value)) {
        amount.value = props.minBid;
        return;
    }
    amount.value = Math.max(props.minBid, Math.round(amount.value / KARAOKE_BID_UNIT) * KARAOKE_BID_UNIT);
};
</script>

<template>
    <div class="rounded-2xl light:bg-default dark:bg-muted p-4 flex flex-col gap-2">
        <UFormField :label="`최소 ${minBid.toLocaleString()}P 이상 · 100P 단위`" class="w-full">
            <div class="flex gap-2">
                <UButton
                    icon="i-ph-minus-bold"
                    color="neutral"
                    variant="subtle"
                    size="xl"
                    class="rounded-lg shrink-0"
                    :disabled="amount <= minBid"
                    @click="decrease"
                />
                <UInput
                    type="number"
                    :min="minBid"
                    :step="KARAOKE_BID_UNIT"
                    size="xl"
                    class="flex-1"
                    :ui="{ base: 'text-center' }"
                    v-model.number="amount"
                    @change="normalize"
                />
                <UButton
                    icon="i-ph-plus-bold"
                    color="neutral"
                    variant="subtle"
                    size="xl"
                    class="rounded-lg shrink-0"
                    @click="increase"
                />
            </div>
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
