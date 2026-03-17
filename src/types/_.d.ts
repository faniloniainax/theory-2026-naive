export type PageData = {
    page: number;
    per_page: number;
    total_pages: number;
    current_entries_size: number;
};

export type Paginated<T> = {
    data: T[];
    pagination: PageData;
};