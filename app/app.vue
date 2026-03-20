<script setup lang="ts">
</script>

<template>
    <NuxtPwaManifest />
    <UApp>
        <div>
            <div
                class="w-screen h-screen flex items-center justify-center"
                v-if="!$device.isMobileOrTablet"
            >
                <p class="text-p1">모바일 전용 서비스입니다! 모바일 기기에서 접속해주세요.</p>
            </div>
            <div v-else>
                <div class="w-screen h-screen flex flex-col items-center justify-center pwa-only-error"> <!-- 개발용 구성 -->
                    <p class="text-p1">미래패스 앱 설치 방법 안내</p>
                    <div v-if="$device.isAndroid">
                        안드로이드
                    </div>
                    <div v-if="$device.isApple">
                        IOS
                    </div>
                    <!-- TODO: 앱 설치 방법 안내. 기종에 따라 이미지 보이도록 할것 -->
                </div>
                <div class="pwa-only-content">
                    <NuxtLayout>
                        <NuxtPage />
                    </NuxtLayout>
                </div>
            </div>
        </div>
    </UApp>
</template>