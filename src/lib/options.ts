import type { Class } from "@/types/class";
import { Texts } from "./texts";
import type { Teacher } from "@/types/teacher";
import type { HourPart } from "@/types/hour_part";
import type { ConstElement } from "@/types/const_element";
import type { Field } from "@/types/field";
import type { Branch } from "@/types/branch";
import type { Stage } from "@/types/stage";

export const Options = {
    formatClasses(c: Class[]) {
        return c.map(c_ => ({
            value: c_['id'],
            label: Texts.formatClass(c_),
        }))
    },
    formatTeachers(t: Teacher[]) {
        return t.map(t_ => ({
            value: t_['id'],
            label: Texts.formatTeacher(t_),
        }))
    },
    formatHourParts(h: HourPart[]) {
        return h.map(h_ => ({
            value: h_['id'],
            label: Texts.formatHourPart(h_),
        }))
    },
    formatConstElements(c: ConstElement[]) {
        return c.map(c_ => ({
            value: c_['id'],
            label: Texts.formatConstElement(c_),
        }))
    },
    formatFields(f: Field[]) {
        return f.map(f_ => ({
            value: f_['id'],
            label: f_['name'],
        }))
    },
    formatBranches(b: Branch[]) {
        return b.map(b_ => ({
            value: b_['id'],
            label: b_['abbreviation'],
        }))
    },
    formatStages(s: Stage[]) {
        return s.map(s_ => ({
            value: s_['id'],
            label: s_['name'],
        }))
    },
};