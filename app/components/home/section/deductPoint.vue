<script setup lang="ts">
import PageButton from "~/components/setting/object.vue";
</script>

<template>
    <NuxtLink to="/system/user-select?a=point" v-slot="{ navigate }" custom>
        <PageButton @click="navigate()" icon="i-ph-hand-coins" label="포인트 결제" />
    </NuxtLink>
</template>