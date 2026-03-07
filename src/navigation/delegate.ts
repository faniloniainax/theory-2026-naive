import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import HomeOutline from 'vicons/ionicons-v5/HomeOutline.vue'
import BookOutline from 'vicons/ionicons-v5/BookOutline.vue'
import CalendarOutline from 'vicons/ionicons-v5/CalendarClearOutline.vue'

export const delegateNavigation: MenuMixedOption[] = [
    {
        key: '/home',
        label: 'Accueil',
        icon: () => h(HomeOutline),
    },
    {
        key: '/logbook',
        label: 'Cahier de texte',
        icon: () => h(BookOutline),
    },
    {
        key: '/calendar',
        label: 'Calendrier pédagogique',
        icon: () => h(CalendarOutline),
    },
];