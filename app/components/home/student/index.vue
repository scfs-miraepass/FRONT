<script setup lang="ts">
import Point from "./point.vue";
import History from "./history/index.vue";

const session = useSession()
</script>

<template>
    <div class="w-screen h-screen p-5 flex flex-col" v-if="session?.type == 'student'">
        <div class="w-full flex items-center justify-between opacity-50 -mt-2">
            <p class="text-ui-p1 font-medium text-black/50">{{ session.id }} {{ session.name }}</p>
            <UButton color="neutral" variant="ghost" icon="i-ph-gear-fill" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </div>
        <div class="pb-2 mt-2.5 flex-1 flex flex-col">
            <Point />
            <hr class="my-3 border-default" />
            <History />
        </div>
    </div>
</template>

<style scoped>

</style>