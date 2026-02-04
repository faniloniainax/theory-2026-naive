import { Http } from "@/lib/http";
import type { Room } from "@/types/room";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const fetchRooms = async (l?: LoadingBarInst, m?: MessageApiInjection): Promise<Room[]> => {
    l?.start();

    try {
        const p = { include: '' };
        const r = await Http.get("/mention/rooms", { params: p });

        if (r.status !== 200)
            throw r.data;

        l?.finish();
        return r.data as Room[];
    } catch (e: any) {
        l?.error();
        if (e?.error)
            m?.error(e.error);
        else
            m?.error("Erreur durant le chargement des salles.");
        console.error(e);
    }

    return [];
};