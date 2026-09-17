<script setup lang="ts">
import { toDateInputValue, addDays } from "@/utils/karaoke";

const date = defineModel<string>("date", { required: true });
const dateInput = ref<HTMLInputElement>();

const isToday = computed(() => date.value === toDateInputValue(new Date()));
const dateLabel = computed(() => {
    const d = new Date(`${date.value}T00:00:00`);
    return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
});

const moveDate = (days: number) => {
    date.value = toDateInputValue(addDays(new Date(`${date.value}T00:00:00`), days));
};
</script>

<template>
    <div class="flex items-center justify-between mb-3">
        <UButton
            @click="moveDate(-1)"
            color="neutral"
            variant="ghost"
            icon="i-ph-caret-left-bold"
            class="p-2 rounded-2xl hover:bg-accented active:bg-accented"
        />
        <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:bg-accented relative"
            @click="dateInput?.showPicker?.() ?? dateInput?.click()"
        >
            <p class="text-p1 font-bold">{{ dateLabel }}</p>
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50" v-if="isToday">오늘</p>
            <input
                type="date"
                ref="dateInput"
                v-model="date"
                class="absolute inset-0 opacity-0 pointer-events-none"
            />
        </button>
        <UButton
            @click="moveDate(1)"
            color="neutral"
            variant="ghost"
            icon="i-ph-caret-right-bold"
            class="p-2 rounded-2xl hover:bg-accented active:bg-accented"
        />
    </div>
</template>
