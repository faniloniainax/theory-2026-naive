import TMainLayout from "@/layouts/TMainLayout.vue";
import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";
import TMobileLayout from "@/layouts/TMobileLayout.vue";

export const delegateRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home',
        meta: { layout: TMobileLayout },
        children: [
            {
                path: '/home',
                meta: { layout: TMobileLayout },
                component: () => import('@/views/delegate/THomeView.vue')
            },
            {
                path: '/logbook',
                meta: { layout: TMobileLayout },
                component: () => import('@/views/delegate/TLogbookView.vue'),
            },
            {
                path: '/calendar',
                meta: { layout: TMobileLayout },
                component: () => import('@/views/delegate/TCalendar.vue'),
            }
        ]
    },
    notFoundRoute
];