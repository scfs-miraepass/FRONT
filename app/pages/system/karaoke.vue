<script setup lang="ts">
import type { Karaokes } from "@/client";
import { karaokeTimeLabel, karaokeStatusLabel, toDateInputValue } from "@/utils/karaoke";

definePageMeta({
    permissions: [UserPermission.MANAGE_KARAOKE] as PermissionCondition,
});

const toast = useToast();

const errorMessage = (err: unknown, fallback = "요청을 처리하지 못했어요.") =>
    err && typeof err === "object" && "message" in err ? String((err as any).message) : fallback;

const timeOptions = Array.from({ length: 8 }, (_, i) => ({ label: karaokeTimeLabel(i + 1), value: i + 1 }));

const form = reactive({
    date: toDateInputValue(new Date()),
    time: 1,
    startTime: "",
    endTime: "",
    minPoint: 0,
});
const creating = ref<boolean>(false);
const deletingId = ref<number | null>(null);

const list = ref<Karaokes[]>([]);
const listPending = ref<boolean>(true);

const loadList = async () => {
    listPending.value = true;
    // 생성된 SDK 타입은 date 필드를 Date로 표기하지만, 요청 검증기는 "YYYY-MM-DD" 문자열을 기대한다.
    const req = await $API.getKaraokeList({ query: { date: form.date as unknown as Date } });
    list.value = req.error ? [] : req.data.data;
    listPending.value = false;
};

watch(() => form.date, loadList, { immediate: true });

const canSubmit = computed(() => !!form.date && !!form.startTime && !!form.endTime);

const create = async () => {
    if (!canSubmit.value) return;
    creating.value = true;
    const req = await $API.createKaraoke({
        body: {
            date: form.date,
            time: form.time,
            start_time: new Date(form.startTime).toISOString(),
            end_time: new Date(form.endTime).toISOString(),
            min_point: form.minPoint,
        } as unknown as Parameters<typeof $API.createKaraoke>[0]["body"],
    });
    creating.value = false;

    if (req.error) {
        toast.add({ title: "경매를 만들지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }
    toast.add({ title: "경매를 만들었어요.", color: "success" });
    form.startTime = "";
    form.endTime = "";
    form.minPoint = 0;
    await loadList();
};

const remove = async (item: Karaokes) => {
    deletingId.value = item.id!;
    const req = await $API.deleteKaraoke({ path: { karaoke_id: item.id! } });
    deletingId.value = null;

    if (req.error) {
        toast.add({ title: "삭제하지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }
    toast.add({ title: "삭제했어요.", color: "success" });
    await loadList();
};
</script>

<template>
    <div class="flex items-center mb-4">
        <NuxtLink to="/" v-slot="{ navigate }" custom>
            <UButton
                @click="navigate()"
                color="neutral"
                variant="ghost"
                icon="i-ph-caret-left-bold"
                class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented"
                size="xl"
            />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">노래방 경매 관리</p>
    </div>

    <div class="flex-1 flex flex-col gap-3 overflow-y-auto">
        <div class="rounded-2xl light:bg-default dark:bg-muted p-4 flex flex-col gap-3">
            <p class="text-p2 font-bold">새 경매 만들기</p>
            <UFormField label="일자">
                <UInput type="date" v-model="form.date" size="xl" class="w-full" />
            </UFormField>
            <UFormField label="교시">
                <USelectMenu
                    v-model="form.time"
                    :items="timeOptions"
                    value-key="value"
                    label-key="label"
                    size="xl"
                    class="w-full"
                />
            </UFormField>
            <UFormField label="경매 시작 시간">
                <UInput type="datetime-local" v-model="form.startTime" size="xl" class="w-full" />
            </UFormField>
            <UFormField label="경매 종료 시간">
                <UInput type="datetime-local" v-model="form.endTime" size="xl" class="w-full" />
            </UFormField>
            <UFormField label="최소 입찰가">
                <UInput type="number" v-model.number="form.minPoint" size="xl" class="w-full" min="0" step="100" />
            </UFormField>
            <UButton class="rounded-xl justify-center flex" :disabled="!canSubmit" :loading="creating" @click="create">
                만들기
            </UButton>
        </div>

        <div class="flex flex-col gap-2">
            <p class="text-p2 font-bold px-1">{{ form.date }}의 경매</p>
            <template v-if="listPending">
                <USkeleton v-for="i in 2" :key="i" class="w-full h-16 rounded-2xl" />
            </template>
            <p class="text-ui-p2 opacity-50 px-1 py-4" v-else-if="list.length <= 0">등록된 경매가 없어요.</p>
            <div
                v-else
                v-for="item in list"
                :key="item.id!"
                class="w-full rounded-2xl light:bg-default dark:bg-muted px-5 py-3 flex items-center justify-between"
            >
                <div>
                    <p class="text-p2 font-bold">{{ karaokeTimeLabel(item.time) }}</p>
                    <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-1">
                        {{ karaokeStatusLabel(item.status) }} · 최소 {{ (item.min_point ?? 0).toLocaleString() }}P
                    </p>
                </div>
                <UButton
                    size="sm"
                    color="error"
                    variant="soft"
                    class="rounded-lg"
                    icon="i-ph-trash"
                    :loading="deletingId === item.id"
                    @click="remove(item)"
                >
                    삭제
                </UButton>
            </div>
        </div>
    </div>
</template>
