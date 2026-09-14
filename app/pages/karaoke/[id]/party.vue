<script setup lang="ts">
import type { KaraokePartyDetail, User } from "@/client";

definePageMeta({
    permissions: [UserPermission.JOIN_KARAOKE] as PermissionCondition,
});

const route = useRoute();
const toast = useToast();
const session = useSession();
const karaokeId = computed(() => Number(route.params.id));

const errorMessage = (err: unknown, fallback = "요청을 처리하지 못했어요.") =>
    err && typeof err === "object" && "message" in err ? String((err as any).message) : fallback;

const party = ref<KaraokePartyDetail | null>(null);
const pending = ref<boolean>(true);
const disperseConfirm = ref<boolean>(false);
const busy = ref<boolean>(false);

const isLeader = computed(() => !!party.value && party.value.leader_id === session.value?.id);

const load = async () => {
    pending.value = true;
    const req = await $API.getMyKaraokeParty({ path: { karaoke_id: karaokeId.value } });
    party.value = req.error ? null : req.data.data;
    pending.value = false;
    if (!party.value) navigateTo(`/karaoke/${karaokeId.value}`, { replace: true });
};

await load();

// 검색
const canSearch = computed(() => hasPermission(session.value?.permissions, UserPermission.SEARCH_USER));
const search = ref<string>("");
const searchResult = ref<User[]>([]);
const searching = ref<boolean>(false);
const invitingId = ref<number | null>(null);
let searchTimeout: ReturnType<typeof setTimeout>;

const takenIds = computed(() => {
    if (!party.value) return new Set<number>();
    return new Set<number>([
        party.value.leader_id,
        ...party.value.members.map((m) => m.id!),
        ...party.value.pending_members.map((m) => m.id!),
    ]);
});

const onSearchInput = (event: InputEvent) => {
    search.value = (event.target as HTMLInputElement).value;
    clearTimeout(searchTimeout);
    const q = search.value.replaceAll(" ", "");
    if (q.length <= 0) {
        searchResult.value = [];
        return;
    }
    searchTimeout = setTimeout(async () => {
        searching.value = true;
        const req = await $API.searchSearchGet({ query: { q, t: ["student", "teacher"] } });
        searching.value = false;
        if (req.error) {
            toast.add({ title: "검색하지 못했어요.", description: errorMessage(req.error), color: "error" });
            return;
        }
        searchResult.value = req.data.data.filter((u) => u.id !== session.value?.id);
    }, 200);
};

const invite = async (user: User) => {
    invitingId.value = user.id!;
    const req = await $API.inviteKaraokePartyMember({
        path: { party_id: party.value!.id },
        body: { user_id: user.id! },
    });
    invitingId.value = null;

    if (req.error) {
        toast.add({ title: "초대하지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }
    toast.add({ title: `${user.name}님을 초대했어요.`, color: "success" });
    await load();
};

const kick = async (user: User) => {
    busy.value = true;
    const req = await $API.kickKaraokePartyMember({
        path: { party_id: party.value!.id, user_id: user.id! },
    });
    busy.value = false;

    if (req.error) {
        toast.add({ title: "내보내지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }
    party.value = req.data.data;
    toast.add({ title: `${user.name}님을 내보냈어요.`, color: "success" });
};

const leave = async () => {
    busy.value = true;
    const req = await $API.leaveKaraokeParty({ path: { party_id: party.value!.id } });
    busy.value = false;

    if (req.error) {
        toast.add({ title: "탈퇴하지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }
    toast.add({ title: "파티에서 나왔어요.", color: "success" });
    navigateTo(`/karaoke/${karaokeId.value}`, { replace: true });
};

const disperse = async () => {
    busy.value = true;
    const req = await $API.disperseKaraokeParty({ path: { party_id: party.value!.id } });
    busy.value = false;

    if (req.error) {
        toast.add({ title: "해산하지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }
    toast.add({ title: "파티를 해산했어요.", color: "success" });
    navigateTo(`/karaoke/${karaokeId.value}`, { replace: true });
};
</script>

<template>
    <div class="flex items-center mb-4">
        <NuxtLink :to="`/karaoke/${karaokeId}`" v-slot="{ navigate }" custom>
            <UButton
                @click="navigate()"
                color="neutral"
                variant="ghost"
                icon="i-ph-caret-left-bold"
                class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented"
                size="xl"
            />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">파티 관리</p>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50" v-if="pending">
        <UIcon name="i-ph-spinner-gap" class="text-h2 mb-1.5 animate-spin" />
        불러오는 중..
    </div>

    <div class="flex-1 flex flex-col gap-3" v-else-if="party">
        <div class="rounded-2xl light:bg-default dark:bg-muted p-4">
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mb-2">파티장</p>
            <div class="flex items-center justify-between">
                <p class="text-p1 font-bold">
                    {{ party.leader.name }}{{ party.leader.number ? ` (${party.leader.grade}학년 ${party.leader.number}반)` : "" }}
                </p>
                <UBadge color="primary" variant="subtle" class="rounded-full">리더</UBadge>
            </div>
        </div>

        <div class="rounded-2xl light:bg-default dark:bg-muted p-4">
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mb-2">
                참여중인 멤버 ({{ party.members.length }}명)
            </p>
            <div class="flex flex-col gap-2" v-if="party.members.length > 0">
                <div class="flex items-center justify-between" v-for="m in party.members" :key="m.id!">
                    <p class="text-p2">{{ m.name }}{{ m.number ? ` (${m.grade}학년 ${m.number}반)` : "" }}</p>
                    <UButton
                        v-if="isLeader"
                        size="xs"
                        color="error"
                        variant="soft"
                        class="rounded-lg"
                        icon="i-ph-user-minus"
                        :disabled="busy"
                        @click="kick(m)"
                    >
                        내보내기
                    </UButton>
                </div>
            </div>
            <p class="text-ui-p2 opacity-50" v-else>아직 참여한 멤버가 없어요.</p>

            <template v-if="party.pending_members.length > 0">
                <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-4 mb-2">초대 대기중</p>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between" v-for="m in party.pending_members" :key="m.id!">
                        <p class="text-p2 opacity-60">{{ m.name }}{{ m.number ? ` (${m.grade}학년 ${m.number}반)` : "" }}</p>
                        <UBadge color="neutral" variant="subtle" class="rounded-full">대기중</UBadge>
                    </div>
                </div>
            </template>
        </div>

        <div class="rounded-2xl light:bg-default dark:bg-muted p-4" v-if="isLeader">
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mb-2">멤버 초대</p>
            <UInput
                type="text"
                size="xl"
                class="w-full"
                icon="i-ph-magnifying-glass"
                placeholder="이름 또는 학번"
                :ui="{ base: 'rounded-2xl' }"
                :model-value="search"
                :disabled="!canSearch"
                @input="onSearchInput"
            />
            <p class="text-ui-p2 text-error mt-2" v-if="!canSearch">
                유저 검색 권한이 없어요. 담당자에게 문의해주세요.
            </p>
            <div class="flex flex-col mt-2" v-if="searching">
                <p class="text-ui-p2 opacity-50 py-2">검색중..</p>
            </div>
            <div class="flex flex-col mt-1" v-else-if="search.length > 0">
                <p class="text-ui-p2 opacity-50 py-2" v-if="searchResult.length <= 0">찾지 못했어요.</p>
                <div
                    v-else
                    v-for="u in searchResult"
                    :key="u.id!"
                    class="flex items-center justify-between py-2"
                >
                    <p class="text-p2">{{ u.name }}{{ u.number ? ` (${u.grade}학년 ${u.number}반)` : "" }}</p>
                    <UButton
                        size="xs"
                        class="rounded-lg"
                        :disabled="takenIds.has(u.id!) || invitingId === u.id"
                        :loading="invitingId === u.id"
                        @click="invite(u)"
                    >
                        {{ takenIds.has(u.id!) ? "초대됨" : "초대" }}
                    </UButton>
                </div>
            </div>
        </div>

        <div class="flex-1" />

        <template v-if="isLeader">
            <div class="flex gap-2" v-if="disperseConfirm">
                <UButton class="rounded-2xl justify-center flex-1" color="neutral" variant="soft" :disabled="busy" @click="disperseConfirm = false">
                    취소
                </UButton>
                <UButton class="rounded-2xl justify-center flex-1" color="error" :loading="busy" @click="disperse">
                    해산할래요
                </UButton>
            </div>
            <UButton v-else class="rounded-2xl justify-center flex" color="error" variant="soft" @click="disperseConfirm = true">
                파티 해산하기
            </UButton>
        </template>
        <UButton v-else class="rounded-2xl justify-center flex" color="error" variant="soft" :loading="busy" @click="leave">
            파티 나가기
        </UButton>
    </div>
</template>
