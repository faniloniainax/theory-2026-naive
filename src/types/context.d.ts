import type { Course } from "./course";
import type { TeachingType } from "./teaching_type";

export type Context = {
    id: string;
    description: string;
    course_id: string;
    teaching_type_id: string;

    teaching_type?: TeachingType;
};