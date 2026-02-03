import type { Element } from "./element";

export type DoneElement = {
    context_id: string;
    element_id: string;

    element?: Element;
};