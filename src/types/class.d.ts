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

export type V1Class = {
    id: number;
    name: string;
    stageId: number;
    branchId: number;
};

export type V1ClassCredentials = {
    id: number;
    hash: string;
    classId: number;
    identifier: string;
};