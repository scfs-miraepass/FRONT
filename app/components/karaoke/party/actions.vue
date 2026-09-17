<script setup lang="ts">
defineProps<{
    isLeader: boolean;
    busy: boolean;
}>();
defineEmits<{ disperse: []; leave: [] }>();

const disperseConfirm = ref<boolean>(false);
</script>

<template>
    <template v-if="isLeader">
        <div class="flex gap-2" v-if="disperseConfirm">
            <UButton class="rounded-2xl justify-center flex-1" color="neutral" variant="soft" :disabled="busy" @click="disperseConfirm = false">
                취소
            </UButton>
            <UButton class="rounded-2xl justify-center flex-1" color="error" :loading="busy" @click="$emit('disperse')">
                해산할래요
            </UButton>
        </div>
        <UButton v-else class="rounded-2xl justify-center flex" color="error" variant="soft" @click="disperseConfirm = true">
            파티 해산하기
        </UButton>
    </template>
    <UButton v-else class="rounded-2xl justify-center flex" color="error" variant="soft" :loading="busy" @click="$emit('leave')">
        파티 나가기
    </UButton>
</template>
