import { ref } from "vue";
import type { Quest } from "@/schemas/quest";
import { $fetch } from "@/composables/$fetch";

interface ResponseModel<T> {
    success: boolean;
    data: T;
}

export const useQuest = () => {
    const quests = ref<Quest[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchQuests = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const req = await $fetch<ResponseModel<Quest[]>>("/quest", {
                method: "GET",
            });
            if (!req || !req.success) {
                throw new Error("퀘스트 목록을 불러오지 못했습니다.");
            }
            quests.value = req.data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            isLoading.value = false;
        }
    };

    const createQuest = async (payload: {
        title: string;
        description: string;
        reward: number;
        end_date: string;
    }) => {
        isLoading.value = true;
        error.value = null;

        try {
            const requestBody = {
                ...payload,
            };
            const req = await $fetch<ResponseModel<Quest>>("/quest/create", {
                method: "POST",
                body: requestBody,
            });
            if (!req || !req.success) {
                throw new Error("퀘스트 생성에 실패했습니다.");
            }
            quests.value.unshift(req.data);
            return req.data;
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
            await $fetch<void>(`/quest/${questId}`, {
                method: "DELETE",
            });
            quests.value = quests.value.filter((item: Quest) => item.id !== questId);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const completeQuest = async (questId: number) => {
        isLoading.value = true;
        error.value = null;

        try {
            const req = await $fetch<ResponseModel<number>>(`/quest/${questId}/complete`, {
                method: "POST",
            });
            if (!req || !req.success) {
                throw new Error("퀘스트 완료 처리에 실패했습니다.");
            }
            return req.data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err);
            return null;
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
        completeQuest,
    };
};
