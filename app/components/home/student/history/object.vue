<script setup lang="ts">
import type { PointHistory } from "@/sdk";

const props = defineProps<PointHistory>()

const amountSign = computed(() => props.changed_amount > 0 ? '+' : '')
</script>

<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <div class="rounded-full bg-[#7DBBFF] p-0.5">
                <p class="tossface aspect-square w-10 h-10 text-[26px] text-center">🧋</p>
            </div>
            <div class="ml-3">
                <p class="text-p1 mb-0.5">{{ reason }}</p>
                <p class="text-ui-p2 text-black/50">19:11</p> <!-- PointHistory에 날짜/시간 속성이 있다면 교체해 주세요 -->
            </div>
        </div>
        <p class="text-p1" :class="{'text-primary': amountSign == '+' }">{{ amountSign }}{{ props.changed_amount.toLocaleString() }}P</p>
    </div>
</template>