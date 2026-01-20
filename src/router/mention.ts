import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";
import TMainLayout from "@/layouts/TMainLayout.vue";

export const mentionRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/allocated-hours',
        meta: { layout: TMainLayout },
        children: [
            {
                path: '/allocated-hours',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TAllocatedHoursView.vue'),
            },
            {
                path: '/rooms',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TRoomsView.vue'),
            },
            {
                path: '/classes',
                meta: { layout: TMainLayout },
                component: () => import("@/views/mention/TClassesView.vue"),
            }
        ]
    },
    notFoundRoute,
];