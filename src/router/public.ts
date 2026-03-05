import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";
import TPublicLayout from "@/layouts/TPublicLayout.vue";

export const publicRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
        meta: { layout: TPublicLayout },
        children: [
            {
                path: '/login',
                component: () => import('@/views/public/TLoginView.vue'),
            }
        ]
    },
    {
        path: '/toor',
        redirect: '/toor/login',
        meta: { layout: TPublicLayout },
        children: [
            {
                path: '/toor/login',
                component: () => import('@/views/public/TRootLoginView.vue'),
            }
        ]
    },
    notFoundRoute
];