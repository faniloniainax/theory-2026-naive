import { Http } from "@/lib/http";
import type { ElementNode } from "@/types/element";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchElementsNodeTree = async (constElementId: string, l?: LoadingBarInst, m?: MessageApiInjection): Promise<ElementNode[]> => {
    l?.start();

    try {
        const p = { include: '', mode: 'node_tree', const_element_id: constElementId };
        const r = await Http.get("/mention/elements", { params: p });

        if (r.status !== 200)
            throw r.data;

        l?.finish();
        return r.data as ElementNode[];
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant le chargement du syllabus en arbre.");
        console.error(e);
    }

    return [];
};

export const addElement = async (e: ElementNode, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.post("/mention/elements", e);

        if (r.status !== 201)
            throw r.data;

        l?.finish();
        m?.success("Elément ajouté avec succès.");
        return true;
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant l'ajout de l'élément.");
        console.error(e);
        return false;
    }
};

export const editElement = async (id: string, e: ElementNode, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.put(`/mention/elements/${id}`, e);

        if (r.status !== 200)
            throw r.data;

        l?.finish();
        m?.success("Elément modifié avec succès.");
        return true;
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant la modification de l'élément.");
        console.error(e);
        return false;
    }
};

export const deleteElement = async (id: string, l?: LoadingBarInst, m?: MessageApiInjection) => {
    l?.start();

    try {
        const r = await Http.delete(`/mention/elements/${id}`);

        if (r.status !== 200)
            throw r.data;

        l?.finish();
        m?.success("Elément supprimé avec succès.");
        return true;
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant la suppression de l'élément.");
        console.error(e);
        return false;
    }
};