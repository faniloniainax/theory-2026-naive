import type { Class } from "@/types/class";
import type { ConstElement } from "@/types/const_element";
import type { HourPart } from "@/types/hour_part";
import type { Teacher } from "@/types/teacher";

export const Texts = {
    formatClass(c?: Class) {
        if (!c)
            return '<aucune classe>';

        const stage = c['stage'] ? c['stage']['name'] : '<aucun niveau>';
        const branch = c['branch'] ? c['branch']['abbreviation'] : '<aucun parcours>';
        const group = c['group'] > 0 ? c['group'] : '';

        return `${stage} ${branch} ${group}`.trim();
    },
    formatTeacher(t?: Teacher) {
        if (!t)
            return '<aucun enseignant>';

        const title = t['title'] ? t['title']['name'] : 'M';
        const firstName = t['first_name'] ?? '';
        const fullName = `${t['last_name']} ${firstName}`.trim();

        if (fullName.length == 0 || (!t['last_name'] && !t['first_name']))
            return `${title} <aucun nom>`;

        return `${title} ${fullName}`;
    },
    formatHourPart(h?: HourPart) {
        if (!h)
            return '<aucune> - <aucune>';

        const beg = h['beg'] ?? '<aucune>';
        const end = h['end'] ?? '<aucune>';

        return `${beg} - ${end}`;
    },
    formatConstElement(c?: ConstElement) {
        if (!c)
            return '<aucun>';

        const code = c['code'] ?? '<aucun code>';
        const name = c['name'] ?? '<aucun nom>';

        return `${code} - ${name}`;
    }
}