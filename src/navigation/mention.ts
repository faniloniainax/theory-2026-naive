import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import AlarmOutline from "vicons/ionicons-v5/AlarmOutline.vue";
import BookOutline from "vicons/ionicons-v5/BookOutline.vue";
import BusinessOutline from "vicons/ionicons-v5/BusinessOutline.vue";
import DocumentOutline from "vicons/ionicons-v5/DocumentOutline.vue";
import DocumentsOutline from "vicons/ionicons-v5/DocumentsOutline.vue";
import HourglassOutline from "vicons/ionicons-v5/HourglassOutline.vue";
import PeopleOutline from "vicons/ionicons-v5/PeopleOutline.vue";

export const mentionNavigation: MenuMixedOption[] = [
    {
        key: '/complete-logbook',
        label: 'Cahier de texte',
        icon: () => h(BookOutline),
    },
    {
        label: 'Programme',
        children: [
            {
                key: '/allocated-hours',
                label: 'Volumes horaires',
                icon: () => h(HourglassOutline)
            },
            {
                key: '/teaching-units',
                label: "Unités d'enseignement",
                icon: () => h(DocumentsOutline),
            },
            {
                key: '/const-elements',
                label: 'Elements constitutifs',
                icon: () => h(DocumentOutline),
            },
        ]
    },
    {
        label: 'Répartition',
        children: [
            {
                key: '/teachers',
                label: 'Enseignants',
                icon: () => h(PeopleOutline),
            },
            {
                key: '/hour-parts',
                label: 'Tranches horaires',
                icon: () => h(AlarmOutline),
            },
            {
                key: '/rooms',
                label: 'Salles',
                icon: () => h(BusinessOutline),
            },
            {
                key: '/classes',
                label: 'Classes',
                icon: () => h(PeopleOutline),
            },
        ]
    }
];