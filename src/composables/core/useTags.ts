import useDates from "./useDates";
import { NTag } from "naive-ui";

export default function useTags() {
    function makeNoneTag(inFeminine: boolean = false) {
        const text = inFeminine ? 'Aucun' : 'Aucune';
        return h(NTag, { type: 'error' }, { default: () => text });
    }

    function makeYesNoTag(x: boolean) {
        const type = x ? 'success' : 'error';
        const text = x ? 'Oui' : 'Non';
        return h(NTag, { type }, { default: () => text });
    }

    function makeDateTag(date: string | Date | undefined) {
        if (!date)
            return makeNoneTag(true);

        const { formatDate } = useDates();
        return h(NTag, { type: 'info' }, { default: () => formatDate(date, "dd MMMM yyyy") });
    }

    function makeCourseCountTag(courseCount: number) {
        const countString = courseCount.toString().padStart(2, '0');
        const courseString = courseCount < 1 ? 'séance' : 'séances';

        let type: 'success' | 'error' | 'warning' | 'info' = 'success';

        if (courseCount < 10)
            type = 'error';
        else if (courseCount < 20)
            type = 'warning';
        else if (courseCount < 40)
            type = 'info';

        return h(NTag, { type }, { default: () => `${countString} ${courseString}` });
    }

    return ({
        makeNoneTag,
        makeYesNoTag,
        makeDateTag,
        makeCourseCountTag,
    });
};