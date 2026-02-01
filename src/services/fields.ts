import { Http } from "@/lib/http";
import type { Field } from "@/types/field";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchFields = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<Field[]> => {
    l?.start();

    try {
        const p = { include: '' };
        const r = await Http.get("/fields", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as Field[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des mentions.");
        console.error(e);
    }

    return [];
};