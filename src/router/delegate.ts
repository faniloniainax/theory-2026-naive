import TMainLayout from "@/layouts/TMainLayout.vue";
import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";

export const delegateRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home',
        meta: { layout: TMainLayout },
        children: [
            {
                path: '/home',
                meta: { layout: TMainLayout },
                component: () => import('@/views/delegate/THomeView.vue')
            },
            {
                path: '/logbook',
                meta: { layout: TMainLayout },
                component: () => import('@/views/delegate/TLogbookView.vue'),
            },
            {
                path: '/calendar',
                meta: { layout: TMainLayout },
                component: () => import('@/views/delegate/TCalendar.vue'),
            }
        ]
    },
    notFoundRoute
];