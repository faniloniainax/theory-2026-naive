import { NTag } from "naive-ui";

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
    }
};