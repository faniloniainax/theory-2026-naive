import type { Course, CourseContext, CourseInfo } from "@/types/course";
import useHttp from "../core/useHttp";

export default function useCourses() {
    const { http } = useHttp();

    async function getCourses(): Promise<Course[]> {
        const courses = await http.get("/delegate/courses");
        return courses.data as Course[];
    }

    async function registerCourse(classId: string, info: CourseInfo, contexts: CourseContext[]) {
        const r = await http.post("/delegate/register_course", {
            "info": info,
            "contexts": contexts,
            "class_id": classId,
        });

        if (r.status !== 201) {
            console.error(r.data);
            return false;
        }

        return true;
    }

    return ({
        getCourses,
        registerCourse,
    });
};