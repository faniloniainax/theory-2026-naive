import type { Semester } from "./semester";
import type { Teacher } from "./teacher";
import type { TeachingUnit } from "./teaching_unit";

export type ConstElement = {
    id: string;
    code: string;
    name: string;
    credits: number;
    ponderation: number;
    teacher_id: string;
    teaching_unit_id: string;
    semester_id: string;
    created_at: string;
    updated_at: string;
    teacher?: Teacher;
    teaching_unit?: TeachingUnit;
    semester?: Semester;
};