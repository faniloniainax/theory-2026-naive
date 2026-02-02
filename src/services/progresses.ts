import { Http } from "@/lib/http";
import type { CrudData, CrudPaginatedData } from "@/types/crud";
import type { Progress, ProgressBlock } from "@/types/progress";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchProgresses = async (l?: LoadingBarInst, m?: MessageApiInjection, filters?: {
    classId?: string,
}, page?: number, pageSize?: number): Promise<CrudData<Progress>> => {
    l?.start();

    try {
        const classId = filters?.classId ?? undefined;

        const p = {
            include: 'Class.Branch, Class.Stage, Teacher.Title, HourPart, ConstElement',
            class_id: classId,
            page: page,
            per_page: pageSize
        };
        const r = await Http.get("/progresses", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();

        if (page && pageSize)
            return r.data as CrudPaginatedData<Progress>;
        return r.data as Progress[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des séances.");
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
        m?.error("Erreur durant le chargement des séances.");
        console.error(e);
    }

    return [];
};

export const addProgress = async (p: ProgressBlock, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.post("/progresses", p);

        if (r.status !== 201)
            throw Error("Erreur inconnue.");

        l?.finish();
        m?.success("Séance ajoutée avec succès.");
        return true;
    } catch (e) {
        l?.error();
        m?.error("Erreur durant l'ajout de la séance.");
        console.error(e);
        return false;
    }
};

export const editProgress = async (id: string, p: ProgressBlock, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.put(`/progresses/${id}`, p);

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        m?.success("Séance modifiée avec succès.");
        return true;
    } catch (e) {
        l?.error();
        m?.error("Erreur durant la modification de la séance.");
        console.error(e);
        return false;
    }
};

export const deleteProgress = async (id: string, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.delete(`/progresses/${id}`);

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        m?.success("Séance supprimée avec succès.");
        return true;
    } catch (e) {
        l?.error();
        m?.error("Erreur durant la suppression de la séance.");
        console.error(e);
        return false;
    }
};