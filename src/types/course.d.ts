import type { Class } from "./class";
import type { ConstElement } from "./const_element";
import type { HourPart } from "./hour_part";
import type { Element } from "./element";
import type { Teacher } from "./teacher";
import type { Room } from "./room";

type CourseCore = {
    id: string;
    date: string;
    class_id: string;
    teacher_id: string;
    hour_part_id: string;
    const_element_id: string;
    fallback_context: string;
    created_at?: string;
    updated_at?: string;
    class?: Class;
    teacher?: Teacher;
    hour_part?: HourPart;
    const_element?: ConstElement;
};

export type Course = {
    id: string;
    date: string;
    hour_part_id: string;
    class_id: string;
    teacher_id: string;
    room_id: string;
    const_element_id: string;
    hour_part?: HourPart;
    class?: Class;
    teacher?: Teacher;
    room?: Room;
    const_element?: ConstElement;
};

export type CourseBlock = CourseCore & {
    program_element_ids: string[];
    program_elements?: Element[];
};