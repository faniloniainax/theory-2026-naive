import { Http } from "@/lib/http";
import type { Branch } from "@/types/branch";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchBranches = async (l?: LoadingBarInst, m?: MessageApiInjection, filters?: {
    fieldId?: string,
}): Promise<Branch[]> => {
    l?.start();

    try {
        const fieldId = filters?.fieldId ?? undefined;

        const p = { include: '', field_id: fieldId };
        const r = await Http.get("/mention/branches", { params: p, });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as Branch[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des parcours.");
        console.error(e);
    }

    return [];
};