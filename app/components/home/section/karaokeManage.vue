<script setup lang="ts">
import PageButton from "~/components/setting/object.vue";
</script>

<template>
    <NuxtLink to="/system/karaoke" v-slot="{ navigate }" custom>
        <PageButton @click="navigate()" icon="i-ph-gear-six" label="노래방 경매 관리" />
    </NuxtLink>
</template>
