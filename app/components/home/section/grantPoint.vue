<script setup lang="ts">
import PageButton from "~/components/setting/object.vue";

const { pending, data: limitResult } = await useAsyncData(
    'teacher.point_limit',
    (_nuxtApp, { signal }) => $API.getLimitSessionPointLimitGet({ signal }),
    {
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
    }
)

const pointLimit = computed<number>(() => {
    if (limitResult.value.data?.success) {
        return limitResult.value.data.data;
    }
    return 0;
});
</script>

<template>
    <NuxtLink to="/system/user-select?a=point" v-slot="{ navigate }" custom>
        <!-- 이거 권한에 따른 표기 처리해줘야함 -->
        <PageButton @click="navigate()" icon="i-ph-hand-coins" label="포인트 지급" :disabled="pointLimit <= 0">
            <template #value>
                <USkeleton class="blur-xs" v-if="pending">
                    1000 포인트 남음
                </USkeleton>
                <!--                        <template v-else-if="session!.is_admin">-->
                <!--                            제한 없음-->
                <!--                        </template>-->
                <template v-else>
                    {{ pointLimit }} 포인트 남음
                </template>
            </template>
        </PageButton>
    </NuxtLink>
</template>