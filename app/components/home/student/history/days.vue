<script setup lang="ts">
defineProps<{
    date: string
}>()
</script>

<template>
    <!-- 하루 그룹 -->
    <div>
        <p class="text-ui-p2 text-black/50 mb-2.5">{{ date }}</p> <!-- 일자 -->
        <div class="flex flex-col gap-y-4">
            <!-- 기록 -->
            <slot />
        </div>
    </div>
</template>