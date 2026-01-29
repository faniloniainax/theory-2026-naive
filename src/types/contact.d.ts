import type { Teacher } from "./teacher";

export type Contact = {
    id: string;
    phone_number: string;
    teacher_id: string;
    created_at?: string;
    updated_at?: string;
    teacher?: Teacher;
};
