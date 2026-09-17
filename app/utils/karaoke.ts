export const KARAOKE_TIME_LABELS: Record<number, string> = {
    1: "1교시",
    2: "2교시",
    3: "3교시",
    4: "4교시",
    5: "5교시",
    6: "6교시",
    7: "7교시",
    8: "점심시간",
};

export const karaokeTimeLabel = (time: number) => KARAOKE_TIME_LABELS[time] ?? `${time}교시`;

export const KARAOKE_STATUS_LABEL: Record<string, string> = {
    Pending: "예정",
    In_Progress: "진행중",
    Confirmed: "마감",
};

export const karaokeStatusLabel = (status?: string | null) =>
    (status && KARAOKE_STATUS_LABEL[status]) ?? "알 수 없음";

// date input(<input type="date">)은 로컬 날짜 기준 "YYYY-MM-DD" 문자열을 그대로 사용해야
// toISOString() 사용시 UTC로 변환되어 자정 근처에 날짜가 하루 밀리는 문제가 생긴다.
export const toDateInputValue = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

// 100포인트 단위로만 입찰할 수 있다.
export const KARAOKE_BID_UNIT = 100;

export const formatDuration = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export interface DutchPayShare {
    perMember: number;
    leaderShare: number;
}

// 백엔드 dutch_pay(amount, headcount)와 동일한 규칙: 100포인트 단위로 절사하고,
// 절사되어 남는 나머지는 파티장이 부담한다.
export const calcDutchPay = (amount: number, headcount: number): DutchPayShare => {
    if (headcount <= 1 || !Number.isFinite(amount) || amount <= 0) {
        return { perMember: 0, leaderShare: amount };
    }
    const perMember = Math.floor(amount / (headcount * 100)) * 100;
    const leaderShare = amount - perMember * (headcount - 1);
    return { perMember, leaderShare };
};

// API 응답 에러 객체에서 사람이 읽을 수 있는 메시지를 뽑아낸다. 형태를 보장할 수 없는 unknown 에러이므로
// message 필드가 있는지 확인 후 없으면 fallback 문구를 사용한다.
export const karaokeErrorMessage = (err: unknown, fallback = "요청을 처리하지 못했어요.") =>
    err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : fallback;
