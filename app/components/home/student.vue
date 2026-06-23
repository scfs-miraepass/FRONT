<script setup lang="ts">
import Point from "@/components/home/point.vue";
import History from "@/components/home/history/index.vue";
import PageButton from "@/components/setting/object.vue";
import Section from "@/components/setting/section.vue";

const session = useSession()
</script>

<template>
    <div class="w-full flex items-center justify-between opacity-50 -mt-2">
        <p class="text-ui-p1 font-medium light:text-black/50 dark:text-white/50">{{ session!.id }} {{ session!.name }}</p>
        <NuxtLink to="/setting" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-gear-fill" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
    </div>
    <div class="pb-2 mt-2.5 flex-1 flex flex-col">
        <Point />
        <Section class="mt-3">
            <NuxtLink to="/ranking" v-slot="{ navigate }" custom>
                <PageButton @click="navigate()" icon="i-ph-ranking" label="포인트 순위" />
            </NuxtLink>
        </Section>
        <hr class="my-3 border-default" />
        <History />
    </div>
</template>