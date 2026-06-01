<script setup lang="ts">
import { Motion } from "motion-v";
import { useElementSize } from '@vueuse/core'

const session = useSession()
const pointStr = computed(() => session.value!.point!.toLocaleString())
const pointContainer = ref(null)
const { width: pointWidth } = useElementSize(pointContainer)
</script>

<template>
    <div class="light:bg-default dark:bg-muted rounded-2xl p-5">
        <div class="text-p1 flex items-center gap-x-2 font-normal">
            <LogoSymbol size="18" />
            보유중인 미래 포인트
        </div>
        <div class="mt-2 text-p0 flex items-center -mb-1">
            <span ref="pointContainer" class="text-h5/10 tracking-tight mr-0.5 flex items-center overflow-y-hidden">
                <Motion
                    as="p"
                    :initial="{ translateY: '100px' }"
                    :animate="{ translateY: '0' }"
                    :transition="{
                        duration: 0.5,
                        delay: (index * 0.075) + 0.5,
                        ease: [0, 0.71, 0.2, 1.01],
                    }"
                    v-for="(i, index) in pointStr"
                >
                    {{ i }}
                </Motion>
            </span>
            <Motion
                :initial="{ opacity: 0, translateX: `-${pointWidth / 2}px` }"
                :animate="{ opacity: 1, translateX: '0' }"
                :transition="{
                    duration: pointStr.length * (0.15),
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }"
                v-if="pointWidth"
            >P</Motion>
        </div>
    </div>
</template>