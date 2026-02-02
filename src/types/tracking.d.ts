import type { TeachingUnit } from "./teaching_unit";

export type TUCompletion = {
    id: string;
    code: string;
    name: string;
    children_string: string;
    total_courses_count: number;
    total_hours_theoric: number;
    current_hours_theoric: number;
    completion_percentage: number;
};

export type CECompletion = {
    id: string;
    code: string;
    name: string;
    teacher: Teacher;
    total_courses_count: number;
    total_hours_theoric: number;
    current_hours_theoric: number;
    completion_percentage: number;
};