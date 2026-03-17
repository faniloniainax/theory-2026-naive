import type { Room } from "@/types/room";
import useHttp from "../core/useHttp";

export default function useRooms() {
    const { http } = useHttp();

    async function getRooms(): Promise<Room[]> {
        const rooms = await http.get("/delegate/rooms");
        return rooms.data as Room[];
    }

    return ({
        getRooms,
    });
}