<script setup lang="ts">
defineProps<{
    name?: string
}>()
</script>

<template>
    <div class="light:bg-default dark:bg-muted rounded-2xl px-3 py-3">
        <p class="text-p2 pb-2 px-2.5 font-bold light:text-black/50 dark:text-white/50" v-if="name">{{ name }}</p>
        <slot />
    </div>
</template>
