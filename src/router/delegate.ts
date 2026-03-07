import TMainLayout from "@/layouts/TMainLayout.vue";
import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";
import TMobileLayout from "@/layouts/TMobileLayout.vue";
import PeopleOutline from "vicons/ionicons-v5/PeopleOutline.vue";
import HomeOutline from "vicons/ionicons-v5/HomeOutline.vue";
import BookOutline from "vicons/ionicons-v5/BookOutline.vue";
import CalendarOutline from "vicons/ionicons-v5/CalendarOutline.vue";

export const delegateRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Délégués',
        redirect: '/home',
        meta: {
            icon: PeopleOutline,
            layout: TMobileLayout,
        },
        children: [
            {
                path: '/home',
                name: 'Accueil',
                meta: {
                    icon: HomeOutline,
                    layout: TMobileLayout,
                },
                component: () => import('@/views/delegate/THomeView.vue')
            },
            {
                path: '/logbook',
                name: 'Cahier de texte',
                meta: {
                    icon: BookOutline,
                    layout: TMobileLayout,
                },
                component: () => import('@/views/delegate/TLogbookView.vue'),
            },
            {
                path: '/calendar',
                name: 'Calendrier pédagogique',
                meta: {
                    icon: CalendarOutline,
                    layout: TMobileLayout,
                },
                component: () => import('@/views/delegate/TCalendarView.vue'),
            }
        ]
    },
    notFoundRoute
];