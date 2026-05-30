<script setup lang="ts">
import { Motion } from "motion-v";
import { useElementSize } from '@vueuse/core'

const session = useSession()

const pointBefore = computed(() => {
    return session.value!.point!.toLocaleString()
})
const pointNow = ref<string | null>(null)
const pointChangeAnimate = ref<boolean>(false)

const pointContainer = ref(null)
const { width: pointWidth } = useElementSize(pointContainer)

watch(pointBefore, (value) => {
    if (pointNow.value == null) {
        pointNow.value = value
        return
    }

    pointChangeAnimate.value = true
    setTimeout(() => {
        pointNow.value = value
        pointChangeAnimate.value = false
    }, ((pointNow.value.length * 0.15) + 0.4) * 1000)

    // TODO: 애니메이션 만들어라 개놈아
})

onMounted(() => {
    pointNow.value = pointBefore.value
})
</script>

<template>
    <div class="light:bg-default dark:bg-muted rounded-2xl p-5">
        <div class="text-p1 flex items-center gap-x-2 font-normal">
            <LogoSymbol size="18" />
            보유중인 미래 포인트
        </div>
        <div class="mt-2 text-p0 flex items-center -mb-1">

            <span ref="pointContainer" class="text-h5/10 tracking-tight mr-0.5 flex items-center overflow-y-hidden">
                <template v-for="(i, index) in pointNow" v-if="pointNow != null">
                    <Motion
                        as="span"
                        :initial="{ y: '100%' }"
                        :animate="{ y: pointChangeAnimate? '100%':'0%' }"
                        :transition="{
                            duration: 0.5,
                            delay: (index * 0.075) + 0.5,
                            ease: [0, 0.71, 0.2, 1.01],
                        }"
                    >
                        {{ i }}
                    </Motion>
                </template>
            </span>
            <!-- TODO: 값 변경될때 P 애니메이션 이상함 -->
            <Motion
                :initial="{ opacity: 0, translateX: `-${pointWidth / 2}px` }"
                :animate="{ opacity: 1, translateX: pointChangeAnimate? `-${pointWidth / 2}px`:'0' }"
                :transition="{
                    duration: pointNow.length * (0.15),
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }"
                v-if="pointWidth"
            >P</Motion>
        </div>
    </div>
</template>