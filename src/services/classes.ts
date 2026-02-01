import { Http } from "@/lib/http";
import type { Class } from "@/types/class";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchClasses = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<Class[]> => {
    l?.start();

    try {
        const p = { include: 'Branch.Field, Stage' };
        const r = await Http.get("/classes", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as Class[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des classes.");
        console.error(e);
    }

    return [];
};