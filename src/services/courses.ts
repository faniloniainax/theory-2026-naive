import { Http } from "@/lib/http";
import type { CrudData, CrudPaginatedData } from "@/types/crud";
import type { Course, CourseBlock } from "@/types/course";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchCourses = async (l?: LoadingBarInst, m?: MessageApiInjection, filters?: {
    classId?: string,
}, page?: number, pageSize?: number): Promise<CrudData<Course>> => {
    l?.start();

    try {
        const classId = filters?.classId ?? undefined;

        const p = {
            include: 'Class.Branch, Class.Stage, Teacher.Title, HourPart, ConstElement, Room, Contexts',
            class_id: classId,
            page: page,
            per_page: pageSize
        };
        const r = await Http.get("/mention/courses", { params: p });

        if (r.status !== 200)
            throw r.data;

        l?.finish();

        if (page && pageSize)
            return r.data as CrudPaginatedData<Course>;
        return r.data as Course[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des séances.");
        console.error(e);
    }

    return [];
};

/**
 * @deprecated
 */
export const fetchProgressBlocks = async (l?: LoadingBarInst, m?: MessageApiInjection, filters?: {
    classId?: string,
}): Promise<CourseBlock[]> => {
    l?.start();

    try {
        const classId = filters?.classId ?? undefined;

        const p = { include: 'Class.Branch, Class.Stage, Teacher.Title, HourPart, ConstElement', class_id: classId };
        const r = await Http.get("/mention/progresses/blocks", { params: p });

        if (r.status !== 200)
            throw Error("Erreur inconnue.");

        l?.finish();
        return r.data as CourseBlock[];
    } catch (e) {
        l?.error();
        m?.error("Erreur durant le chargement des séances.");
        console.error(e);
    }

    return [];
};

export const addCourse = async (c: Course, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.post("/mention/courses", c);

        if (r.status !== 201)
            throw r.data;

        l?.finish();
        m?.success("Séance ajoutée avec succès.");
        return true;
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant l'ajout de la séance.");
        console.error(e);
        return false;
    }
};

export const editCourse = async (id: string, c: Course, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.put(`/mention/courses/${id}`, c);

        if (r.status !== 200)
            throw r.data;

        l?.finish();
        m?.success("Séance modifiée avec succès.");
        return true;
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant la modification de la séance."); console.error(e);
        return false;
    }
};

export const deleteCourse = async (id: string, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.delete(`/mention/courses/${id}`);

        if (r.status !== 200)
            throw r.data;

        l?.finish();
        m?.success("Séance supprimée avec succès.");
        return true;
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant la suppression de la séance.");
        console.error(e);
        return false;
    }
};