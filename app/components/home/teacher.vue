<script setup lang="ts">
import Point from "@/components/home/point.vue";
import History from "@/components/home/history/index.vue";
import PageButton from "@/components/setting/object.vue";
import Section from "@/components/setting/section.vue";

const session = useSession();

const { pending, data: limitResult } = await useAPI<Result<number>>("/point/limit", {
    method: "GET",
    key: 'teacher_point_limit',
    transform(data) {
        return {
            ...data,
            expiresAt: Date.now() + 10 * 1000
        }
    },
    getCachedData(key, nuxtApp) {
        const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        if (cachedData && cachedData.expiresAt >= Date.now()) {
            return cachedData;
        }
        return undefined;
    }
})

const pointLimit = computed<number>(() => {
    if (limitResult.value?.success) {
        return limitResult.value.data;
    }
    return 0;
});
</script>

<template>
    <div class="w-full flex items-center justify-between opacity-50 -mt-2">
        <p class="text-ui-p1 font-medium  light:text-black/50 dark:text-white/50">{{ session!.name }} 선생님</p>
        <NuxtLink to="/setting" v-slot="{ navigate }" custom>
            <UButton @click="navigate()" color="neutral" variant="ghost" icon="i-ph-gear-fill" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
    </div>
    <div class="pb-2 mt-2.5 flex-1 flex flex-col">
        <Point />
        <Section class="mt-3">
            <NuxtLink to="/only/teacher/grant" v-slot="{ navigate }" custom>
                <PageButton @click="navigate()" icon="i-ph-hand-coins" label="포인트 지급" :disabled="pointLimit <= 0 && !session.is_admin">
                    <template #value>
                        <USkeleton class="blur-xs" v-if="pending">
                            1000 포인트 남음
                        </USkeleton>
                        <template v-else-if="session.is_admin">
                            제한 없음
                        </template>
                        <template v-else>
                            {{ pointLimit }} 포인트 남음
                        </template>
                    </template>
                </PageButton>
            </NuxtLink>
            <NuxtLink to="/ranking" v-slot="{ navigate }" custom>
                <PageButton @click="navigate()" icon="i-ph-ranking" label="포인트 순위" />
            </NuxtLink>
        </Section>
        <hr class="my-3 border-default " />
        <History />
    </div>
</template>