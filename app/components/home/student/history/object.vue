<script setup lang="ts">
import type { PointHistory } from "@/sdk";

const props = defineProps<PointHistory>()

const amountSign = computed(() => props.changed_amount > 0 ? '+' : '')

const formattedTime = computed(() => {
    const date = new Date(props.created_at!);
    const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    return kstDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
})

const icon = computed(() => {
    if (!props.type) {
        return {
            icon: "🧊",
            color: "#586475"
        }
    }
    return {
        "teacher": {
            icon: "🎓",
            color: "#a2bcff"
        },
        "cafe": {
            icon: "🧋",
            color: "#7bd58f"
        },
        "food": {
            icon: "🥐",
            color: "#a191ff"
        },
    }[props.type]
})
</script>

<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <div class="rounded-full bg-(--color) p-0.5" :style="`--color: ${icon.color}`">
                <p class="tossface aspect-square w-10 h-10 text-[26px] text-center -mb-px">{{ icon.icon }}</p>
            </div>
            <div class="ml-3">
                <p class="text-p1 mb-0.5">{{ reason }}</p>
                <p class="text-ui-p2 light:text-black/50 dark:text-white/50">{{ formattedTime }}</p>
            </div>
        </div>
        <p class="text-p1" :class="{'text-primary': amountSign == '+' }">{{ amountSign }}{{ props.changed_amount.toLocaleString() }}P</p>
    </div>
</template>