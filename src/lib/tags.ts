import { format } from "date-fns";
import { NTag } from "naive-ui";
import { h } from "vue";
import { fr } from 'date-fns/locale/fr';

export const Tags = {
    getNoneTag(feminine: boolean = false) {
        let text = 'Aucun'

        if (feminine)
            text += 'e';

        return h(
            NTag,
            { type: 'error' },
            { default: () => text }
        )
    },
    getYesOrNoTag(yes: boolean) {
        return h(
            NTag,
            { type: yes ? 'success' : 'error' },
            { default: () => yes ? 'Oui' : 'Non' }
        );
    },
    getDateTag(date: string | Date | undefined) {
        if (!date) return this.getNoneTag();

        return h(
            NTag,
            { type: 'info' },
            { default: () => format(new Date(date), "dd MMMM yyyy", { locale: fr }) }
        );
    },
    getProgressCount(n: number) {
        let nStr = n.toString().padStart(3, '0');
        let str = "séance";
        let type = "";

        if (n > 1)
            str = "séances";

        if (n <= 10)
            type = 'error';
        else if (n <= 20)
            type = 'warning';
        else if (n <= 40)
            type = 'info';
        else
            type = 'success';

        return h(
            NTag,
            { type: type as any },
            { default: () => `${nStr} ${str}` }
        );
    }
};