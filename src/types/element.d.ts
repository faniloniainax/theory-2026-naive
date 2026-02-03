import type { ConstElement } from "./const_element";

export type Element = {
    id: string;
    label: string;
    parent_id: string;
    const_element_id: string;
    created_at?: string;
    updated_at?: string;
    parent?: Element;
    const_element?: ConstElement;
};

