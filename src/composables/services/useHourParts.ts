import type { HourPart } from "@/types/hour_part";
import useHttp from "../core/useHttp";

export default function useHourParts() {
    const { http } = useHttp();

    async function getHourParts(): Promise<HourPart[]> {
        const hourParts = await http.get("/delegate/hour_parts");
        return hourParts.data as HourPart[];
    }

    return ({
        getHourParts,
    });
};