import { type KaraokeBids, KaraokeStatus } from "@/client";

export interface KaraokeSocketState {
    highest_bid: KaraokeBids | null;
    bids_history: KaraokeBids[];
    remaining_time: number;
}

type KaraokeSubData =
    | { type: "status"; data: KaraokeStatus }
    | { type: "highest"; data: KaraokeSocketState }
    | { type: "sync"; data: number };

// 노래방 경매 실시간 상태 구독. `/karaoke/{id}/ws`는 OpenAPI 스펙에 포함되지 않아 SDK가 생성되지 않으므로 직접 연결한다.
export const useKaraokeSocket = (
    karaokeId: MaybeRefOrGetter<number>,
    enabled: MaybeRefOrGetter<boolean> = true,
) => {
    const status = ref<KaraokeStatus | null>(null);
    const highestState = ref<KaraokeSocketState | null>(null);
    const remainingTime = ref<number>(0);
    const isConnected = ref<boolean>(false);

    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let reconnectDelay = 1000;
    let stopped = false;

    const cleanupSocket = () => {
        clearTimeout(reconnectTimeout);
        if (ws) {
            ws.onopen = null;
            ws.onmessage = null;
            ws.onclose = null;
            ws.onerror = null;
            ws.close();
            ws = null;
        }
        isConnected.value = false;
    };

    const connect = () => {
        if (!import.meta.client || stopped) return;
        cleanupSocket();

        const id = toValue(karaokeId);
        const protocol = location.protocol === "https:" ? "wss" : "ws";
        const socket = new WebSocket(`${protocol}://${location.host}/api/karaoke/${id}/ws`);
        ws = socket;

        socket.onopen = () => {
            isConnected.value = true;
            reconnectDelay = 1000;
        };
        socket.onmessage = (event) => {
            const payload = JSON.parse(event.data) as KaraokeSubData;

            switch (payload.type) {
                case "highest":
                    highestState.value = payload.data;
                    remainingTime.value = payload.data.remaining_time;
                    break;
                case "status":
                    status.value = payload.data;
                    break;
                case "sync":
                    remainingTime.value = payload.data;
                    break;
            }
        };
        socket.onclose = () => {
            isConnected.value = false;
            if (stopped || !toValue(enabled)) return;
            reconnectTimeout = setTimeout(() => {
                reconnectDelay = Math.min(reconnectDelay * 2, 15000);
                connect();
            }, reconnectDelay);
        };
        socket.onerror = () => socket.close();
    };

    if (import.meta.client) {
        watchEffect(() => {
            if (toValue(enabled)) {
                connect();
            } else {
                cleanupSocket();
            }
        });
    }

    const countdownInterval = import.meta.client
        ? setInterval(() => {
              if (remainingTime.value > 0) remainingTime.value -= 1;
          }, 1000)
        : undefined;

    onScopeDispose(() => {
        stopped = true;
        clearInterval(countdownInterval);
        cleanupSocket();
    });

    return { status, highestState, remainingTime, isConnected };
};
