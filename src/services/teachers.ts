import { Http } from "@/lib/http";
import type { Teacher } from "@/types/teacher";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchTeachers = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<Teacher[]> => {
    l?.start();

    try {
        const p = { include: 'Title, Rank' };
        const r = await Http.get("/teachers", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as Teacher[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des enseignants.");
        console.error(e);
    }

    return [];
};