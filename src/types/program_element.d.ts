import type { ConstElement } from "./const_element";

export type ProgramElement = {
    id: string;
    label: string;
    const_element_id: string;
    created_at: string;
    updated_at: string;
    const_element?: ConstElement;
};