import { ref } from "vue";
import { $fetch as _fetch } from "@/composables/$fetch";
import type { QuestResponse } from "@/sdk";
import { useAPI } from "@/composables/useAPI";
import type { Result } from "@/schemas/response";

interface QuestCreatePayload {
    title: string;
    description: string;
    reward: number;
    end_date: string;
}

export const useQuest = () => {
    const quests = ref<QuestResponse[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const requestQuest = async <T>(url: string, options?: Parameters<typeof useAPI>[1]) => {
        const req = await useAPI<Result<T>>(url, options);

        if (req.error.value) {
            throw req.error.value;
        }

        return req;
    };

    const fetchQuests = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const req = await requestQuest<QuestResponse[]>("/quest", {
                method: "GET",
            });

            if (!req.data.value?.success) {
                throw new Error("퀘스트 목록을 불러오지 못했습니다.");
            }

            quests.value = req.data.value.data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            isLoading.value = false;
        }
    };

    const createQuest = async (payload: QuestCreatePayload) => {
        isLoading.value = true;
        error.value = null;

        try {
            const req = await requestQuest<QuestResponse>("/quest/create", {
                method: "POST",
                body: payload,
            });

            if (!req.data.value?.success) {
                throw new Error("퀘스트 생성에 실패했습니다.");
            }

            quests.value.unshift(req.data.value.data);
            return req.data.value.data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteQuest = async (questId: number) => {
        isLoading.value = true;
        error.value = null;

        try {
            await requestQuest<void>(`/quest/${questId}`, {
                method: "DELETE",
            });

            quests.value = quests.value.filter((item) => item.id !== questId);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

        const acceptQuest = async (questId: number) => {
            isLoading.value = true;
            error.value = null;
            try {
                const res = await _fetch(`/quest/${questId}/accept`, { method: "POST" });
                if (!res || res.success === false) {
                    throw new Error("퀘스트 수락에 실패했습니다.");
                }
                return true;
            } catch (err) {
                error.value = err instanceof Error ? err.message : String(err);
                return false;
            } finally {
                isLoading.value = false;
            }
        };

        const fetchAcceptedStudents = async (questId: number) => {
            isLoading.value = true;
            error.value = null;
            try {
                const res = await _fetch(`/quest/${questId}/accepted`, { method: "GET" });
                if (!res || res.success === false) {
                    throw new Error("수락한 학생 목록을 불러오지 못했습니다.");
                }
                return res.data as { id: number; name: string; grade?: number; number?: number }[];
            } catch (err) {
                error.value = err instanceof Error ? err.message : String(err);
                return null;
            } finally {
                isLoading.value = false;
            }
        };

    const hasAccepted = async (questId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await _fetch(`/quest/${questId}/accept`, { method: "GET" });
            if (!res || res.success === false) {
                throw new Error("수락 여부를 불러오지 못했습니다.");
            }
            return !!res.data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const cancelAccept = async (questId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await _fetch(`/quest/${questId}/accept`, { method: "DELETE" });
            if (!res || res.success === false) {
                throw new Error("수락 취소에 실패했습니다.");
            }
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        quests,
        isLoading,
        error,
        fetchQuests,
        createQuest,
        deleteQuest,
        acceptQuest,
        fetchAcceptedStudents,
        hasAccepted,
        cancelAccept,
    };
};
