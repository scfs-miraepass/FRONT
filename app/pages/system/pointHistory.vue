<script setup lang="ts">
</script>

<template>
    <div class="flex items-center">
        <NuxtLink to="/" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-caret-left-bold" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">탄소중립 동아리 페스티벌</p>
    </div>
    <div>

    </div>
</template>