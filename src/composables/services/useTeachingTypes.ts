import type { TeachingType } from "@/types/teaching_type";
import useHttp from "../core/useHttp";

export default function useTeachingTypes() {
    const { http } = useHttp();

    async function getTeachingTypes(): Promise<TeachingType[]> {
        const tt = await http.get("/delegate/teaching_types");
        return tt.data as TeachingType[];
    }

    return ({
        getTeachingTypes,
    });
}