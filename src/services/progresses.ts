import { Http } from "@/lib/http";
import type { Progress, ProgressBlock } from "@/types/progress";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchProgresses = async (l?: LoadingBarInst, m?: MessageApiInjection, filters?: {
    classId?: string,
}): Promise<Progress[]> => {
    l?.start();

    try {
        const classId = filters?.classId ?? undefined;

        const p = { include: 'Class.Branch, Class.Stage, Teacher.Title, HourPart, ConstElement', class_id: classId };
        const r = await Http.get("/progresses", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as Progress[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des enregistrements des cours.");
        console.error(e);
    }

    return [];
};

export const fetchProgressBlocks = async (l?: LoadingBarInst, m?: MessageApiInjection, filters?: {
    classId?: string,
}): Promise<ProgressBlock[]> => {
    l?.start();

    try {
        const classId = filters?.classId ?? undefined;

        const p = { include: 'Class.Branch, Class.Stage, Teacher.Title, HourPart, ConstElement', class_id: classId };
        const r = await Http.get("/progresses/blocks", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as ProgressBlock[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des enregistrements des cours.");
        console.error(e);
    }

    return [];
};