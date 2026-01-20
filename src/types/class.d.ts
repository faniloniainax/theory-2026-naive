import type { Branch } from "./branch";
import type { Stage } from "./stage";

export type Class = {
    id: string;
    branch_id: string;
    stage_id: string;
    group: number;
    created_at?: string;
    updated_at?: string;
    branch?: Branch;
    stage?: Stage;
};