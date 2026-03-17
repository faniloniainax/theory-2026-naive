import type { Class } from "./class";

export type Login = {
    identifier: string;
    password: string;
};

export type User = {
    name: string;
    type: string;
    email: string;
    token: string;
    class: null | Class;
};