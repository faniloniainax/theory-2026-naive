import type { SelectMixedOption } from "naive-ui/lib/select/src/interface";

export type CrudType = 'error' | 'success' | 'info' | 'primary' | 'secondary' | 'warning';

export type CrudAction = {
    name: string;
    type: CrudType;
};

export type CrudCoreInput = {
    name: string;
    path: string;
    span?: number;
};

export type CrudDateInput = CrudCoreInput & {
    kind: 'date';
    placeholder?: string;
};

export type CrudNumberInput = CrudCoreInput & {
    kind: 'number';
    max?: number;
    min?: number;
    placeholder?: string;
    required: boolean;
};

export type CrudStringInput = CrudCoreInput & {
    kind: 'string';
    max?: number;
    min?: number;
    placeholder?: string;
    textArea?: boolean;
    required: boolean;
};

export type CrudForeignInput = CrudCoreInput & {
    kind: 'foreign';
    url: string;
    placeholder?: string;
    params?: any;
    plural?: string;
    mapFn: (x: any) => SelectMixedOption;
    required: boolean;
};

export type CrudBooleanInput = CrudCoreInput & {
    kind: 'boolean';
    required: boolean;
};

export type CrudHourInput = CrudCoreInput & {
    kind: 'hour';
    required: boolean;
    placeholder?: string;
};

export type CrudInput = CrudDateInput | CrudNumberInput | CrudStringInput | CrudForeignInput | CrudBooleanInput | CrudHourInput;

export type CrudFilter = {
    url: string;
    path: string;
    placeholder?: string;
    mapFn: (x: any) => SelectMixedOption;
};