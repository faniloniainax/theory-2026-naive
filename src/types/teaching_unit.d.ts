import type { Branch } from "./branch";
import type { Stage } from "./stage";

export type TeachingUnit = {
    id: string;
    code: string;
    name: string;
    stage_id: string;
    branch_id: string;
    created_at?: string;
    updated_at?: string;
    stage?: Stage;
    branch?: Branch;
};