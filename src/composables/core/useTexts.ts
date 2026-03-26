import type { Branch } from "@/types/branch";
import type { Class } from "@/types/class";
import type { ConstElement } from "@/types/const_element";
import type { Field } from "@/types/field";
import type { HourPart } from "@/types/hour_part";
import type { Rank } from "@/types/rank";
import type { Room } from "@/types/room";
import type { Stage } from "@/types/stage";
import type { Teacher } from "@/types/teacher";
import type { Title } from "@/types/title";

export default function useTexts() {
    function makeFieldText(f?: Field) {
        return f ? f['name'] : '<AUCUNE MENTION>';
    }

    function makeBranchText(b?: Branch) {
        return b ? b['abbreviation'] : '<AUCUN PARCOURS>';
    }

    function makeStageText(s?: Stage) {
        return s ? s['name'] : '<AUCUN NIVEAU>';
    }

    function makeGroupText(groupNumber: number) {
        if (groupNumber <= 0)
            return "";

        return groupNumber.toString();
    }

    function makeClassText(c?: Class) {
        if (!c)
            return '<AUCUNE CLASSE>';

        const stage = makeStageText(c['stage']);
        const branch = makeBranchText(c['branch']);
        const group = makeGroupText(c['group']);

        return `${stage} ${branch} ${group}`.trim();
    }

    function makeTitleText(t?: Title) {
        return t ? t['name'] : 'M';
    }

    function makeRankText(r?: Rank) {
        return r ? r['name'] : '<AUCUN GRADE>';
    }

    function makeTeacherText(t?: Teacher) {
        if (!t)
            return '<AUCUN ENSEIGNANT>';

        const title = makeTitleText(t['title']);
        const firstName = t['first_name'] ?? '';
        const lastName = t['last_name'] ?? '';
        const fullName = `${lastName} ${firstName}`.trim();

        if (fullName.length === 0)
            return `${title} <AUCUN NOM>`;

        return `${title} ${fullName}`.trim();
    }

    function makeShortTeacherText(t?: Teacher) {
        if (!t)
            return '<AUCUN ENSEIGNANT>';

        const title = makeTitleText(t['title']);
        const lastName = t['last_name'] ?? '';
        const trilogy = t['trilogy'];

        return `${title} ${trilogy}`;
    }

    function makeHourPartText(h?: HourPart) {
        if (!h)
            return '<AUCUNE TRANCHE HORAIRE>';

        const b = h['beg'] ?? '<AUCUN DEBUT>';
        const e = h['end'] ?? '<AUCUNE FIN>';

        return `${b} - ${e}`;
    }

    function makeConstElementText(c?: ConstElement) {
        if (!c)
            return '<AUCUN ELEMENT CONSTITUTIF>';

        const code = c['code'] ?? '<AUCUN CODE>';
        const name = c['name'] ?? '<AUCUN NOM>';

        return `${code} - ${name}`;
    }

    function makeRoomText(r?: Room) {
        if (!r)
            return '<AUCUNE SALLE>';

        return r['name'];
    }

    return ({
        makeFieldText,
        makeBranchText,
        makeStageText,
        makeGroupText,
        makeClassText,
        makeTitleText,
        makeRankText,
        makeShortTeacherText,
        makeTeacherText,
        makeHourPartText,
        makeConstElementText,
        makeRoomText,
    });
}