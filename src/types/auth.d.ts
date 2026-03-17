export type Login = {
    identifier: string;
    password: string;
};

export type User = {
    name: string;
    type: string;
    email: string;
    token: string;
    class_id: string;
};