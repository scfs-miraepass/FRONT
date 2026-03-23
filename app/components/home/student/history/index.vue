<script setup lang="ts">
import Group from "./days.vue";
import Obj from "./object.vue";
import type { PointHistory } from "@/sdk";
import type { Result } from "@/schemas/response";

const maxOffset = ref<number>(0)
const dataOffset = ref<number>(1)
const historyPayload = ref<PointHistory[]>([])
const showLoading = ref<boolean>(false)
let loadingTimeout: any;

const historyData = computed(() => {
    return historyPayload.value.reduce((acc, item) => {
        const date = new Date(item.created_at!);
        const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
        const key = `${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {} as Record<string, PointHistory[]>);
});

const { pending } = await useAPI<Result<PointHistory[]>>("/point/history", {
    method: "GET",
    onResponse({ response }) {
        maxOffset.value = Number(response.headers.get("X-MAX-PAGE"))
        if (!response._data?.success) return

        if (dataOffset.value === 1) {
            historyPayload.value = response._data.data;
        } else {
            historyPayload.value.push(...response._data.data);
        }
    }
})

watch(pending, () => {
    if (pending.value) {
        loadingTimeout = setTimeout(() => {
            showLoading.value = true
        }, 200)
    } else {
        if (loadingTimeout) clearTimeout(loadingTimeout)
        showLoading.value = false
    }
}, { immediate: true })
</script>

<template>
    <div class="w-full px-6 py-7 light:bg-default dark:bg-muted rounded-2xl flex-1 flex flex-col gap-y-6">
        <div class="flex items-center justify-between" v-for="i in 6" :key="i" v-if="showLoading">
            <div class="flex items-center">
                <USkeleton class="rounded-full light:bg-elevated dark:bg-accented/50 p-0.5">
                    <p class="tossface aspect-square w-10 h-10 text-[26px] text-center" />
                </USkeleton>
                <div class="ml-3">
                    <USkeleton class="h-4.5 w-25 mb-1 rounded-full light:bg-elevated dark:bg-accented/50" />
                    <USkeleton class="h-3.5 w-15 rounded-full light:bg-elevated dark:bg-accented/50" />
                </div>
            </div>
            <USkeleton class="h-4.5 w-20 mb-1 rounded-full light:bg-elevated dark:bg-accented/50" />
        </div>
        <!-- TODO: 이거 등장 애니메이션 넣고 싶은데.. -->
        <!-- TODO: 무한 스크롤 구현해야함 -->
        <!-- TODO: 아이콘 어떻게 처리할지 생각좀 하고 -->
        <Group v-for="(items, date) in historyData" :key="date" :date="date" v-else-if="historyPayload.length">
            <Obj v-for="item in items" v-bind="item" />
        </Group>
        <div class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50" v-else-if="!pending">
            <UIcon name="i-ph-smiley-sad-thin" class="text-h2 mb-1.5" />
            포인트 사용기록이 존재하지 않아요..
        </div>
    </div>
</template>