import { Http } from "@/lib/http";
import type { Stage } from "@/types/stage";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchStages = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<Stage[]> => {
    l?.start();

    try {
        const p = { include: '' };
        const r = await Http.get("/mention/stages", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as Stage[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des niveaux.");
        console.error(e);
    }

    return [];
};