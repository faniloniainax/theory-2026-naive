import type { Teacher } from "@/types/teacher";
import useHttp from "../core/useHttp";

export default function useTeachers() {
    const { http } = useHttp();

    async function getTeachers(): Promise<Teacher[]> {
        const params = {
            include: "Title, Rank",
        };
        const teachers = await http.get("/delegate/teachers", { params });
        return teachers.data as Teacher[];
    }

    return ({
        getTeachers,
    });
}