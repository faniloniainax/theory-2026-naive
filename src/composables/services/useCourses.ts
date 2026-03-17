import type { Course, CourseContext, CourseInfo } from "@/types/course";
import useHttp from "../core/useHttp";
import type { CrudPaginatedData } from "@/types/crud";
import type { Paginated } from "@/types/_";

export default function useCourses() {
    const { http } = useHttp();

    async function getAllCourses(): Promise<Course[]> {
        const params = {
            include: "HourPart, Teacher, ConstElement"
        };
        const courses = await http.get("/delegate/courses", { params });
        return courses.data as Course[];
    }

    async function getCourses(page: number, perPage: number): Promise<Paginated<Course>> {
        const params = {
            "page": page,
            "per_page": perPage,
            "include": "HourPart, Teacher, ConstElement",
        };

        const r = await http.get("/delegate/courses", { params });
        return r.data as Paginated<Course>;
    };

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
        getAllCourses,
        registerCourse,
    });
};