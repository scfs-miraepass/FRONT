<script setup lang="ts">
import Search from "../search/index.vue";

const session = useSession();
</script>

<template>
    <div class="w-full flex items-center justify-between opacity-50 -mt-2">
        <p class="text-ui-p1 font-medium  light:text-black/50 dark:text-white/50">{{ session!.name }} 선생님</p>
        <NuxtLink to="/setting" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-gear-fill" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
    </div>
    <div class="pb-2 mt-2.5 flex-1 flex flex-col">
        <Search />
    </div>
</template>