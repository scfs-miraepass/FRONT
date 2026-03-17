<script setup lang="ts">
const nuxtApp = useNuxtApp();
const isPageLoading = useState("isPageLoading", () => true);

const route = useRoute();

let showLoadingTimer: any = null;
const loadingShownTime = useState<number>("loadingShownTime.value");

interface metaType {
    manualPageLoading?: boolean;
    pageLoadingMinTime?: number; // 로딩바 최소 노출 시간 (기본값: 500, 단위: ms) - 이동 후 페이지에서
    pageLoadingThreshold?: number; // 로딩바 노출 전 대기 시간 (이 시간보다 짧으면 로딩바 안뜸) (기본값: 200, 단위: ms) - 이동전 페이지에서
}

nuxtApp.hook("page:start", () => {
    const meta = route.meta as metaType;

    if (showLoadingTimer) clearTimeout(showLoadingTimer);

    const threshold = meta.pageLoadingThreshold ?? 200;

    if (threshold === 0) {
        isPageLoading.value = true;
        loadingShownTime.value = Date.now();
    } else {
        showLoadingTimer = setTimeout(() => {
            isPageLoading.value = true;
            loadingShownTime.value = Date.now();
        }, threshold);
    }
});

nuxtApp.hook("page:finish", () => {
    const meta = route.meta as metaType;

    if (showLoadingTimer) {
        clearTimeout(showLoadingTimer);
        showLoadingTimer = null;
    }
    if (meta.manualPageLoading) return;

    if (isPageLoading.value) {
        const elapsed = Date.now() - loadingShownTime.value;
        const pageLoadingMinTime = meta.pageLoadingMinTime ?? 500;
        if (elapsed < pageLoadingMinTime) {
            setTimeout(() => {
                isPageLoading.value = false;
            }, pageLoadingMinTime - elapsed);
        } else {
            isPageLoading.value = false;
        }
    }
});

// 개발시 화이트 모드에서 만들기 위해 구성함
const colorMode = useColorMode();
colorMode.preference = "light";

const appInstall = async () => {
    console.log(nuxtApp.$pwa);
    nuxtApp.$pwa?.install();
};
</script>

<template>
    <UApp>
        <NuxtPwaManifest />
        <div
            class="w-screen h-screen flex items-center justify-center text-p1"
            v-if="!$device.isMobileOrTablet"
        >
            모바일 전용 서비스입니다! 모바일 기기에서 접속해주세요.
        </div>
        <div
            class="w-screen h-screen flex items-center justify-center text-p1"
            v-else-if="!nuxtApp.$pwa?.isPWAInstalled"
        > <!-- 개발용 구성 -->
            ㅁㄴㅇㄹ
            <!-- TODO: 앱 설치 방법 안내. 기종에 따라 이미지 보이도록 할것 -->
        </div>
        <div :class="{ 'hidden': !nuxtApp.$pwa?.isPWAInstalled || !$device.isMobileOrTablet }">
            <NuxtPage />
        </div>
    </UApp>
</template>
