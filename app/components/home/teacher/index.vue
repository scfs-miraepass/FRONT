<script setup lang="ts">
import Obj from "./object.vue";
import { searchSearchGet, type User } from "@/sdk";

const session = useSession();
const search = ref<string>("");
const searchResult = ref<User[]>([]);
const hiddenResult = ref<boolean>(false);
const loadingResult = ref<boolean>(false);
let searchTimeout: any;
let beforeSearch: string = '';

watch(searchResult, () => {
    loadingResult.value = false
    hiddenResult.value = false
})

const userSearch = async () => {
    const _search = search.value.replaceAll(" ", "")
    if (beforeSearch == _search) return
    beforeSearch = _search
    if (_search.length <= 0) {
        searchResult.value = []
        return
    }
    setTimeout(() => {
        if (hiddenResult.value) {
            loadingResult.value = true
        }
    }, 350)
    const req = await searchSearchGet({
        query: {
            q: _search,
            t: ["student"]
        }
    })
    if (req.error) {
        // TODO: 에러 처리
        return
    }
    searchResult.value = req.data.data
}

const onSearchInput = async (event: InputEvent) => {
    hiddenResult.value = true
    search.value = (event.target as HTMLInputElement).value
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
        await userSearch()
    }, 200)
}
</script>

<template>
    <div class="w-full flex items-center justify-between opacity-50 -mt-2">
        <p class="text-ui-p1 font-medium text-black/50">{{ session!.name }} 선생님</p>
        <NuxtLink to="/setting">
            <UButton color="neutral" variant="ghost" icon="i-ph-gear-fill" class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented" size="xl" />
        </NuxtLink>
    </div>
    <div class="pb-2 mt-2.5 flex-1 flex flex-col">
        <UInput
            type="text"
            size="xl"
            class="w-full"
            icon="i-ph-magnifying-glass"
            placeholder="학생의 이름또는 학번"
            :ui="{ base: 'rounded-2xl' }"
            @input="onSearchInput"
            v-model="search"
        />
        <hr class="my-3 border-default" />
        <div class="px-1 py-2.5 light:bg-default dark:bg-muted rounded-2xl flex-1 overflow-y-scroll relative">
            <div class="w-full h-full flex flex-col justify-center items-center transition-opacity duration-250 absolute top-0 left-0 pointer-events-none" :class="{ 'opacity-0!': !loadingResult }">
                <USkeleton class="flex flex-col justify-center items-center bg-transparent">
                    <UIcon name="i-ph-spinner-gap" class="text-h2 mb-1.5 animate-spin" />
                    검색중..
                </USkeleton>
            </div>
            <div class="w-full h-full flex flex-col transition-opacity duration-250" :class="{ 'max-h-0': searchResult.length > 0, 'opacity-0': hiddenResult }">
                <p class="px-5 pt-4.5 pb-1.5 text-ui-p1">{{ searchResult.length }}명의 학생들 찾았어요.</p>
                <div class="w-full h-full flex flex-col items-center justify-center text-ui-p1 opacity-50" v-if="searchResult.length <= 0">
                    <UIcon :name="search.length > 0? 'i-ph-smiley-sad-thin':'i-ph-magnifying-glass-thin'" class="text-h2 mb-1.5" />
                    {{ search.length > 0? '학생을 찾지 못했어요.':'지금 학생을 찾아보세요!' }}
                </div>
                <Obj v-bind="i" v-for="i in searchResult" />
            </div>

        </div>
    </div>
</template>