import { Http } from "@/lib/http";
import type { TUCompletion } from "@/types/tracking";
import type { HeatmapData } from "naive-ui";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchActivityForTeacher = async (teacherId: string, classId: string, constElementId: string, year?: number, l?: LoadingBarInst, m?: MessageApiInjection): Promise<HeatmapData> => {
    l?.start();

    try {
        const params: Record<string, any> = { include: '' };
        if (year) {
            params.year = year;
        }
        const r = await Http.get(`/tracking/teacher_activity/${teacherId}/${classId}/${constElementId}`, { params });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as HeatmapData;
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des données des enseignements.");
        console.error(e);
    }

    return [];
};

export const fetchTUCompletion = async (stageId: string, branchId: string, classId: string, l?: LoadingBarInst, m?: MessageApiInjection): Promise<TUCompletion[]> => {
    l?.start();

    try {
        const r = await Http.get(`/tracking/progress/${stageId}/${branchId}/${classId}`);

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as TUCompletion[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des données des progrès.");
        console.error(e);
    }

    return [];
}