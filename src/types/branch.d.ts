import type { Field } from "./field";

export type Branch = {
    id: string;
    abbreviation: string;
    field_id: string;
    created_at: string;
    updated_at: string;
    field?: Field;
};