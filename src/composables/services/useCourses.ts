import type { Course, CourseContext, CourseInfo } from "@/types/course";
import useHttp from "../core/useHttp";
import type { CrudPaginatedData } from "@/types/crud";
import type { Paginated } from "@/types/_";

export default function useCourses() {
    const { http } = useHttp();

    async function getAllCourses(): Promise<Course[]> {
        const params = {
            include: "HourPart, Teacher, ConstElement, Contexts"
        };
        const courses = await http.get("/delegate/courses", { params });
        return courses.data as Course[];
    }

    async function getCourses(page: number, perPage: number): Promise<Paginated<Course>> {
        const params = {
            "page": page,
            "per_page": perPage,
            "include": "HourPart, Teacher, ConstElement, Contexts",
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

    function makeContextRecord(ctxArray: CourseContext[]): Record<string, string> {
        const record: Record<string, string> = {};

        ctxArray.forEach(ctx => {
            record[ctx['teaching_type_id']] = ctx['description'];
        });

        return record;
    }

    function makeContextArray(ctxRecord: Record<string, string>): CourseContext[] {
        const ctxArray: CourseContext[] = [];

        for (const teachingTypeId in ctxRecord) {
            let description = ctxRecord[teachingTypeId];

            if (!description)
                description = "";

            ctxArray.push({
                teaching_type_id: teachingTypeId,
                description: description,
            });
        }

        return ctxArray;
    }

    return ({
        getCourses,
        getAllCourses,
        registerCourse,
        makeContextRecord,
        makeContextArray
    });
};