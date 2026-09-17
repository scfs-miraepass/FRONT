<script setup lang="ts">
import type { KaraokeResponse } from "@/client";
import Card from "./card.vue";

defineProps<{
    items: KaraokeResponse[];
    pending: boolean;
}>();
defineEmits<{ select: [item: KaraokeResponse] }>();
</script>

<template>
    <div class="flex-1 flex flex-col gap-2">
        <template v-if="pending">
            <USkeleton v-for="i in 4" :key="i" class="w-full h-18 rounded-2xl" />
        </template>
        <div
            class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50 py-16"
            v-else-if="items.length <= 0"
        >
            <UIcon name="i-ph-calendar-blank" class="text-h2 mb-1.5" />
            이 날짜엔 예정된 경매가 없어요.
        </div>
        <Card v-else v-for="item in items" :key="item.id!" :item="item" @click="$emit('select', item)" />
    </div>
</template>
