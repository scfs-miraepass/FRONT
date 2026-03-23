<script setup lang="ts">
import Obj from "./object.vue";
import { searchSearchGet, type User } from "@/sdk";

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

const onSelect = (user: User) => {
    const userData = useState<User | undefined>("service.point.user.data", () => undefined)
    userData.value = user

    navigateTo("/service/point")
}
</script>

<template>
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
    <div class="px-1 py-2.5 light:bg-default dark:bg-muted rounded-2xl flex-1 overflow-y-scroll relative flex flex-col">
        <div class="w-full h-full flex flex-col justify-center items-center transition-opacity duration-250 absolute top-0 left-0 pointer-events-none" :class="{ 'opacity-0!': !loadingResult }">
            <USkeleton class="flex flex-col justify-center items-center bg-transparent">
                <UIcon name="i-ph-spinner-gap" class="text-h2 mb-1.5 animate-spin" />
                검색중..
            </USkeleton>
        </div>
        <div class="flex-1 flex flex-col transition-opacity duration-250" :class="{ 'max-h-0': searchResult.length > 0, 'opacity-0': hiddenResult }">
            <p class="px-5 pt-4.5 pb-1.5 text-ui-p2 light:text-black/50 dark:text-white/50">{{ searchResult.length }}명의 학생들 찾았어요.</p>
            <div class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50" v-if="searchResult.length <= 0">
                <UIcon :name="search.length > 0? 'i-ph-smiley-sad-thin':'i-ph-magnifying-glass-thin'" class="text-h2 mb-1.5" />
                {{ search.length > 0? '학생을 찾지 못했어요.':'지금 학생을 찾아보세요!' }}
            </div>
            <Obj v-bind="i" v-for="i in searchResult" @click="onSelect(i)" />
        </div>
    </div>
</template>