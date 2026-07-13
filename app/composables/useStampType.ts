import type { StampType } from "@/sdk"

export const useStampType = () => useState<StampType | undefined>('service.stamp-type', () => undefined)