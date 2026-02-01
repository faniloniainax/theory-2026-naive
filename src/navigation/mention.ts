import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import AlarmOutline from "vicons/ionicons-v5/AlarmOutline.vue";
import BookOutline from "vicons/ionicons-v5/BookOutline.vue";
import BusinessOutline from "vicons/ionicons-v5/BusinessOutline.vue";
import DocumentOutline from "vicons/ionicons-v5/DocumentOutline.vue";
import DocumentsOutline from "vicons/ionicons-v5/DocumentsOutline.vue";
import HourglassOutline from "vicons/ionicons-v5/HourglassOutline.vue";
import PeopleOutline from "vicons/ionicons-v5/PeopleOutline.vue";
import WarningOutline from "vicons/ionicons-v5/WarningOutline.vue";
import StatsChartOutline from 'vicons/ionicons-v5/StatsChartOutline.vue';
import BookDatabaseOutline from 'vicons/fluent/BookDatabase24Regular.vue';
import CalendarAddOutline from 'vicons/fluent/CalendarAdd24Regular.vue';
import AppsListOutline from 'vicons/fluent/AppsList24Regular.vue';
import MoreOutline from 'vicons/fluent/More24Regular.vue';

export const mentionNavigation: MenuMixedOption[] = [
    {
        key: '/activity',
        label: 'Enseignements',
        icon: () => h(BookDatabaseOutline),
    },
    {
        key: '/progress',
        label: 'Progrès des cours',
        icon: () => h(StatsChartOutline),
    },
    {
        key: '/complete-logbook',
        label: 'Cahier de texte',
        icon: () => h(BookOutline),
    },
    {
        key: '/program',
        label: 'Programme',
        icon: () => h(CalendarAddOutline),
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
            {
                key: '/syllabus',
                label: 'Syllabus',
                icon: () => h(WarningOutline),
            },
        ]
    },
    {
        key: '/repartition',
        label: 'Répartition',
        icon: () => h(AppsListOutline),
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
    },
    {
        key: '/others',
        label: 'Autres',
        icon: () => h(MoreOutline),
        children: [
            {
                key: '/contacts',
                label: 'Contacts',
                icon: () => h(WarningOutline),
            },
            {
                key: '/unavailabilities',
                label: 'Indisponibilités',
                icon: () => h(WarningOutline),
            },
            {
                key: '/semesters',
                label: 'Semestres',
                icon: () => h(WarningOutline),
            },
        ]
    }
];