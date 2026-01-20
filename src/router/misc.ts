import type { RouteRecordRaw } from "vue-router";

export const notFoundRoute: RouteRecordRaw = {
    path: '/:pathMatch(.*)*',
    component: () => import("@/views/public/T404.vue")
};