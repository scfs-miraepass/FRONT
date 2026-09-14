<script setup lang="ts">
import { karaokeTimeLabel } from "@/utils/karaoke";

definePageMeta({
    permissions: [UserPermission.JOIN_KARAOKE] as PermissionCondition,
});

const toast = useToast();

interface InviteRow {
    partyId: number;
    karaokeId: number;
    leaderName: string;
    dateLabel: string;
    timeLabel: string;
    deciding: boolean;
}

const rows = ref<InviteRow[]>([]);
const pending = ref<boolean>(true);

const errorMessage = (err: unknown) =>
    err && typeof err === "object" && "message" in err ? String((err as any).message) : "요청을 처리하지 못했어요.";

const load = async () => {
    pending.value = true;
    const invitesReq = await $API.getMyKaraokePartyInvites();
    if (invitesReq.error || !invitesReq.data) {
        pending.value = false;
        return;
    }

    const pendingInvites = invitesReq.data.data.filter((i) => i.pending);
    const resolved = await Promise.all(
        pendingInvites.map(async (invite): Promise<InviteRow | null> => {
            const partyReq = await $API.getKaraokeParty({ path: { party_id: invite.party_id } });
            if (partyReq.error) return null;
            const karaokeReq = await $API.getKaraoke({ path: { karaoke_id: partyReq.data.data.auction_id } });
            if (karaokeReq.error) return null;

            return {
                partyId: invite.party_id,
                karaokeId: partyReq.data.data.auction_id,
                leaderName: partyReq.data.data.leader.name,
                dateLabel: new Date(karaokeReq.data.data.date).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                }),
                timeLabel: karaokeTimeLabel(karaokeReq.data.data.time),
                deciding: false,
            };
        }),
    );

    rows.value = resolved.filter((r): r is InviteRow => r !== null);
    pending.value = false;
};

await load();

const decide = async (row: InviteRow, accept: boolean) => {
    row.deciding = true;
    const req = await $API.decideKaraokePartyInvite({
        path: { party_id: row.partyId },
        body: { accept },
    });
    row.deciding = false;

    if (req.error) {
        toast.add({ title: "처리하지 못했어요.", description: errorMessage(req.error), color: "error" });
        return;
    }

    rows.value = rows.value.filter((r) => r.partyId !== row.partyId);

    if (accept) {
        toast.add({ title: "초대를 수락했어요.", color: "success" });
        navigateTo(`/karaoke/${row.karaokeId}`);
    }
};
</script>

<template>
    <div class="flex items-center mb-4">
        <NuxtLink to="/karaoke" v-slot="{ navigate }" custom>
            <UButton
                @click="navigate()"
                color="neutral"
                variant="ghost"
                icon="i-ph-caret-left-bold"
                class="p-2 rounded-2xl hover:bg-accented active:bg-accented focus-visible:bg-accented"
                size="xl"
            />
        </NuxtLink>
        <p class="text-2xl font-bold text-gray-900 dark:text-white ml-1">파티 초대함</p>
    </div>

    <div class="flex-1 flex flex-col gap-2">
        <template v-if="pending">
            <USkeleton v-for="i in 3" :key="i" class="w-full h-20 rounded-2xl" />
        </template>
        <div
            class="flex-1 flex flex-col items-center justify-center text-ui-p1 opacity-50 py-16"
            v-else-if="rows.length <= 0"
        >
            <UIcon name="i-ph-bell-slash" class="text-h2 mb-1.5" />
            받은 초대가 없어요.
        </div>
        <div
            v-else
            v-for="row in rows"
            :key="row.partyId"
            class="w-full rounded-2xl light:bg-default dark:bg-muted px-5 py-4"
        >
            <p class="text-p1 font-bold">{{ row.leaderName }}님의 파티</p>
            <p class="text-ui-p2 light:text-black/50 dark:text-white/50 mt-1">
                {{ row.dateLabel }} {{ row.timeLabel }} 노래방 예약
            </p>
            <div class="flex gap-2 mt-3">
                <UButton
                    class="rounded-xl justify-center flex-1"
                    color="neutral"
                    variant="soft"
                    :disabled="row.deciding"
                    @click="decide(row, false)"
                >
                    거절
                </UButton>
                <UButton class="rounded-xl justify-center flex-1" :disabled="row.deciding" @click="decide(row, true)">
                    수락
                </UButton>
            </div>
        </div>
    </div>
</template>
