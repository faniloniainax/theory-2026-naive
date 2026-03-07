import type { Course } from "@/types/course";
import useHttp from "../core/useHttp";

export default function useCourses() {
    const { http } = useHttp();

    async function getCourses(): Promise<Course[]> {
        const courses = await http.get("/delegate/courses");
        return courses.data as Course[];
    }

    return ({
        getCourses,
    });
};