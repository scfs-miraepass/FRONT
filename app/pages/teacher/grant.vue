<script setup lang="ts">
import Search from "@/components/home/search/index.vue";

definePageMeta({
    permissions: ['teacher'] as UserType[]
})

const session = useSession();
</script>

<template>
    <div class="flex items-center mb-4">
        <NuxtLink to="/" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-caret-left-bold" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">포인트 지급</p>
    </div>
    <div class="flex-1 flex flex-col">
        <Search />
    </div>
</template>