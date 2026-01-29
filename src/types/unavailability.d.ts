import type { Teacher } from "./teacher";

export type Unavailability = {
    id: string;
    reason: string;
    beg: string;
    end: string;
    teacher_id: string;
    created_at?: string;
    updated_at?: string;
    teacher?: Teacher;
};
