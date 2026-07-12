<script setup lang="ts">
import type { StampsList } from "@/sdk";
import type { Result } from "@/schemas/response";

const payload = ref<StampsList[]>([])

const { pending } = await useAPI<Result<StampsList[]>>('/stamp', {
    method: "GET",
    async onResponse({ response }) {
        if (!response._data?.success) return
        payload.value = response._data.data
    }
})
</script>

<template>
    <div class="flex items-center">
        <NuxtLink to="/" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-caret-left-bold" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">탄소중립 동아리 페스티벌</p>
    </div>
    <div class="text-center my-10">
        <p class="text-xl">부스에 참여해 스탬프를 받아보세요!</p>
        <p class="text-base light:text-black/50 dark:text-white/50">스탬프를 통해 포인트를 받을 수 있어요.</p>
    </div>
    <hr class="border-default mt-1" />
    <div class="px-10 py-8 space-y-8">
        <StampObject v-for="i in payload" v-bind="i" />
    </div>
</template>