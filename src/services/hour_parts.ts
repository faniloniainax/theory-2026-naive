import { Http } from "@/lib/http";
import type { HourPart } from "@/types/hour_part";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchHourParts = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<HourPart[]> => {
    l?.start();

    try {
        const p = { include: '' };
        const r = await Http.get("/mention/hour_parts", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as HourPart[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des tranches horaires.");
        console.error(e);
    }

    return [];
};