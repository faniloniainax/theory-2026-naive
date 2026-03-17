import type { ConstElement } from "@/types/const_element";
import useHttp from "../core/useHttp";

export default function useConstElements() {
    const { http } = useHttp();

    async function getConstElements(stageId?: string, branchId?: string): Promise<ConstElement[]> {
        const params = {
            "stage_id": stageId,
            "branch_id": branchId,
        };
        const constElements = await http.get("/delegate/const_elements", { params });
        return constElements.data as ConstElement[];
    }

    return ({
        getConstElements,
    });
}