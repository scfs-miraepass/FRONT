<script setup lang="ts">
import RankingList from "@/components/ranking/list.vue";

const items = [
    {
        label: '학생',
        icon: 'i-hugeicons-student',
        slot: 'student' as const
    },
    {
        label: '선생님',
        icon: 'i-hugeicons-teaching',
        slot: 'teacher' as const
    }
]
</script>

<template>
    <div class="flex items-center mb-4">
        <NuxtLink to="/" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-caret-left-bold" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">포인트 순위</p>
    </div>

    <UTabs variant="link" :items="items" class="w-full" :ui="{ content: 'space-y-10 pt-10' }">
        <template #student>
            <RankingList type="student" />
        </template>
        <template #teacher>
            <RankingList type="teacher" />
        </template>
    </UTabs>
</template>