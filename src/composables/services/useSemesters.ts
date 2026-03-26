import type { CalendarDates } from "@/types/semester";
import useHttp from "../core/useHttp";

export default function useSemesters() {
    const { http } = useHttp();

    async function getCalendarDates(classId: string): Promise<CalendarDates[]> {
        const params = { "class_id": classId, };
        const r = await http.get("/delegate/calendar_dates", { params });

        return r.data as CalendarDates[];
    }

    return ({
        getCalendarDates,
    });
}