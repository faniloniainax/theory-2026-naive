import TPublicLayout from "@/layouts/TPublicLayout.vue";
import type { RouteRecordRaw } from "vue-router";

export const notFoundRoute: RouteRecordRaw = {
    path: '/:pathMatch(.*)*',
    meta: { layout: TPublicLayout },
    component: () => import("@/views/public/T404.vue")
};