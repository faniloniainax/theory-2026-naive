import { Http } from "@/lib/http";
import type { TeachingType } from "@/types/teaching_type";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchTeachingTypes = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<TeachingType[]> => {
    l?.start();

    try {
        const p = {};
        const r = await Http.get("/mention/teaching_types", { params: p });

        if (r.status !== 200)
            throw r.data;

        l?.finish();
        return r.data as TeachingType[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des types d'enseignment.");
        console.error(e);
    }

    return [];
};