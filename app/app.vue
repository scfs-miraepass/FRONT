<script setup lang="ts">
// 개발시 화이트 모드에서 만들기 위해 구성함
const colorMode = useColorMode()
colorMode.preference = 'light'
</script>

<template>
    <UApp>
        <NuxtPage v-if="$device.isMobile" />
        <div class="w-screen h-screen flex items-center justify-center text-p1" v-else>
            모바일 전용 서비스입니다! 모바일 기기에서 접속해주세요.
        </div>
    </UApp>
</template>