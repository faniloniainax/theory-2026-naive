import { Http } from "@/lib/http";
import type { ConstElement } from "@/types/const_element";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchConstElements = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<ConstElement[]> => {
    l?.start();

    try {
        const p = { include: 'Teacher.Title, TeachingUnit, Semester' };
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