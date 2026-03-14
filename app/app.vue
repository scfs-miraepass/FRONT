<script setup lang="ts">

</script>

<template>
    <NuxtPage v-if="$device.isMobile" />
    <div class="w-screen h-screen flex items-center justify-center text-p1-p1" v-else>
        모바일 전용 서비스입니다! 모바일 기기에서 접속해주세요.
    </div>
</template>