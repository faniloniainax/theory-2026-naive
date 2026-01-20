import type { Stage } from "./stage";

export type Semester = {
    id: string;
    number: number;
    courses_beg: string;
    courses_end: string;
    exams_beg: string;
    exams_end: string;
    retrials_beg: string;
    retrials_end: string;
    stage_id: string;
    created_at: string;
    updated_at: string;
    stage?: Stage;
};