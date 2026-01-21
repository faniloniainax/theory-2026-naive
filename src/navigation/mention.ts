import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";

export const mentionNavigation: MenuMixedOption[] = [
    {
        key: '/complete-logbook',
        label: 'Cahier de texte',
    },
    {
        label: 'Programme',
        children: [
            {
                key: '/allocated-hours',
                label: 'Volumes horaires',
            },

            {
                key: '/const-elements',
                label: 'Element constitutifs'
            },
        ]
    },
    {
        label: 'Répartition',
        children: [
            {
                key: '/rooms',
                label: 'Salles',
            },
            {
                key: '/classes',
                label: 'Classes',
            },
        ]
    }
];