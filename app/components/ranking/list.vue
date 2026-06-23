<script setup lang="ts">
import Obj from "@/components/ranking/object.vue";
import type { RankingResponse } from "@/sdk";
import type { Result } from "@/schemas/response";

const props = defineProps<{
    type: 'student' | 'teacher'
}>()

const maxOffset = ref<number>(0)
const dataOffset = ref<number>(1)
const payloadData = ref<RankingResponse[]>([])

const queryParams = computed(() => ({
    limit: 15,
    offset: (dataOffset.value - 1) * 15
}))


const { pending } = await useAPI<Result<RankingResponse[]>>(`/point/ranking/${props.type}`, {
    method: "GET",
    query: queryParams,
    async onResponse({ response }) {
        maxOffset.value = Number(response.headers.get("X-MAX-PAGE"))
        if (!response._data?.success) return

        if (dataOffset.value === 1) {
            payloadData.value = response._data.data;
        } else {
            payloadData.value.push(...response._data.data);
        }
    }
})


const { scrollYProgress } = useScroll()

useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (current >= (dataOffset.value <= 3? 0.50:0.85)) {
        if (pending.value || dataOffset.value >= maxOffset.value) {
            return
        }
        dataOffset.value++
    }
})
</script>

<template>
    <Obj
        v-for="(i, index) in payloadData"
        v-bind="i" :keys="i.id"
        :style="{ animationDelay: dataOffset == 1? `${index * 100}ms`:undefined }"
        :class="{ 'animate-fade-up-blur opacity-0': dataOffset == 1 }"
    />
    <p class="text-ui-p2 light:text-black/50 dark:text-white/50 text-center" v-if="dataOffset >= maxOffset">더이상 없어요</p>
</template>
