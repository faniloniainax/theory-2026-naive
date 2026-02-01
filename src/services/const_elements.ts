import { Http } from "@/lib/http";
import type { ConstElement } from "@/types/const_element";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchConstElements = async (l?: LoadingBarInst, m?: MessageApiInjection, filters?: {
    teachingUnitId?: string,
    branchId?: string,
    stageId?: string,
}): Promise<ConstElement[]> => {
    l?.start();

    try {
        const tuId = filters?.teachingUnitId ?? undefined;
        const bId = filters?.branchId ?? undefined;
        const sId = filters?.stageId ?? undefined;

        const p = { include: 'Teacher.Title, TeachingUnit, Semester', teaching_unit_id: tuId, branch_id: bId, stage_id: sId };
        const r = await Http.get("/const_elements", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as ConstElement[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des éléments constitutifs.");
        console.error(e);
    }

    return [];
};