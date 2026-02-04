import type { Teacher } from "@/types/teacher";
import useTexts from "./useTexts";
import type { Class } from "@/types/class";
import type { HourPart } from "@/types/hour_part";
import type { ConstElement } from "@/types/const_element";
import type { Field } from "@/types/field";
import type { Branch } from "@/types/branch";
import type { Room } from "@/types/room";

export default function useSelectOptions() {
    const { makeFieldText, makeBranchText, makeClassText, makeTeacherText, makeHourPartText, makeConstElementText, makeRoomText, } = useTexts();

    function makeClassOptions(classes: Class[]) {
        return classes.map(c => ({
            value: c['id'],
            label: makeClassText(c),
        }));
    }

    function makeTeacherOptions(teachers: Teacher[]) {
        return teachers.map(t => ({
            value: t['id'],
            label: makeTeacherText(t),
        }));
    }

    function makeHourPartOptions(hourParts: HourPart[]) {
        return hourParts.map(h => ({
            value: h['id'],
            label: makeHourPartText(h),
        }));
    }

    function makeConstElementOptions(constElements: ConstElement[]) {
        return constElements.map(c => ({
            value: c['id'],
            label: makeConstElementText(c),
        }));
    }

    function makeFieldOptions(fields: Field[]) {
        return fields.map(f => ({
            value: f['id'],
            label: makeFieldText(f),
        }));
    }

    function makeBranchOptions(branches: Branch[]) {
        return branches.map(b => ({
            value: b['id'],
            label: makeBranchText(b),
        }));
    }

    function makeRoomOptions(rooms: Room[]) {
        return rooms.map(r => ({
            value: r['id'],
            label: makeRoomText(r),
        }));
    }

    return ({
        makeClassOptions,
        makeTeacherOptions,
        makeHourPartOptions,
        makeConstElementOptions,
        makeFieldOptions,
        makeBranchOptions,
        makeRoomOptions,
    });
};