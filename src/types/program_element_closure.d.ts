import type { ProgramElement } from "./program_element";

export type ProgramElementClosure = {
    id: string;
    child_id: string;
    parent_id: string;
    created_at: string;
    updated_at: string;
    child?: ProgramElement;
    parent?: ProgramElement;
};