import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";

export const publicRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
        children: [
            {
                path: '/login',
                component: () => import('@/views/public/TLoginView.vue'),
            }
        ]
    },
    notFoundRoute
];