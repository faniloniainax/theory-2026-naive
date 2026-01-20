import type { ConstElement } from "./const_element";
import type { HourPart } from "./hour_part";
import type { ProgramElement } from "./program_element";
import type { Teacher } from "./teacher";

export type Progress = {
    id: string;
    date: string;
    class_id: string;
    teacher_id: string;
    hour_part_id: string;
    const_element_id: string;
    program_element_id: string;
    fallback_context: string;
    created_at: string;
    updated_at: string;
    teacher?: Teacher;
    hour_part?: HourPart;
    const_element?: ConstElement;
    program_element?: ProgramElement;
};