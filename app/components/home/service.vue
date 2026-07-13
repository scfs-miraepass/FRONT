<script setup lang="ts">
import Section from "~/components/setting/section.vue";
import PageButton from "~/components/setting/object.vue";

const session = useSession();
</script>

<template>
    <div class="w-full flex items-center justify-between opacity-50 -mt-2">
        <p class="text-ui-p1 font-medium  light:text-black/50 dark:text-white/50">{{ session!.name }}</p>
        <NuxtLink to="/setting" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-gear-fill" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
    </div>
    <div class="pb-2 mt-2.5 flex-1 flex flex-col">
        <Section>
            <NuxtLink to="/system/user-select?a=point" v-slot="{ navigate }" custom>
                <PageButton @click="navigate()" icon="i-ph-hand-coins" label="포인트 결제" />
            </NuxtLink>
            <NuxtLink to="/system/user-select?a=service-stamp" v-slot="{ navigate }" custom>
                <PageButton @click="navigate()" icon="material-symbols-light:festival-rounded" label="'탄소중립 동아리 페스티벌' 스탬프 지급" />
            </NuxtLink>
        </Section>
    </div>
</template>