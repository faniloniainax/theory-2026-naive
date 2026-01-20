import type { ConstElement } from "./const_element";
import type { TeachingType } from "./teaching_type";

export type AllocatedHour = {
    id: string;
    quantity: number;
    const_element_id: string;
    teaching_type_id: string;
    created_at?: string;
    updated_at?: string;
    const_element?: ConstElement;
    teaching_type?: TeachingType;
};