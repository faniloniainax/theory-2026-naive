import type { Rank } from "./rank";
import type { Title } from "./title";

export type Teacher = {
    id: string;
    trilogy: string;
    first_name: string;
    last_name: string;
    email: string;
    is_permanent: boolean;
    rank_id: string;
    title_id: string;
    created_at?: string;
    updated_at?: string;
    rank?: Rank;
    title?: Title;
};