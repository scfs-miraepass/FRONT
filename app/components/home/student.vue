<script setup lang="ts">
import { Motion } from "motion-v";
import { useElementSize } from '@vueuse/core'

const session = useSession()
const pointStr = computed(() => session.value!.point!.toLocaleString())
const pointContainer = ref(null)
const { width: pointWidth } = useElementSize(pointContainer)
</script>

<template>
    <div class="w-screen h-screen p-5" v-if="session?.type == 'student'">
        <div class="w-full flex items-center justify-between opacity-50 pl-2">
            <p class="text-ui-p1">{{ session.name }}님</p>
            <UButton color="neutral" variant="ghost" icon="i-ph-gear-fill" class="p-2 rounded-2xl" size="xl" />
        </div>
        <div class="px-2 pb-2 mt-4">

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
                                delay: index * 0.075,
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
                            duration: pointStr.length * (0.1),
                            ease: [0, 0.71, 0.2, 1.01],
                        }"
                        v-if="pointWidth"
                    >P</Motion>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>