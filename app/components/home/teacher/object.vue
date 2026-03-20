<script setup lang="ts">
import type { User } from "@/sdk";

defineProps<User>()
</script>

<template>
    <button class="px-5 py-4.5 rounded-xl flex flex-col items-start transition-all active:scale-95 active:opacity-50 active:bg-accented">
        <div class="flex items-center text-ui-p2">
            <p class="rounded-full bg-rose-400 px-3 py-1.5 mr-2" v-if="number! <= 2">
                바이오메디컬과
            </p>
            <p class="rounded-full bg-blue-400 px-3 py-1.5 mr-2" v-else-if="number! <= 4">
                소프트웨어통신과
            </p>
            <p class="rounded-full bg-yellow-400 px-3 py-1.5 mr-2" v-else>
                IoT전기전자과
            </p>
            {{ grade }}학년 {{ number }}반
        </div>
        <p class="text-p0 mt-1">{{ name }}</p>
    </button>
</template>