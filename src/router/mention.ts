import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";
import TMainLayout from "@/layouts/TMainLayout.vue";

export const mentionRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/complete-logbook',
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
            },
            {
                path: '/const-elements',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TConstElementsView.vue'),
            },
            {
                path: '/complete-logbook',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TCompleteLogbookView.vue'),
            },
            {
                path: '/teachers',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TTeachersView.vue'),
            },
            {
                path: '/hour-parts',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/THourPartsView.vue'),
            },
            {
                path: '/teaching-units',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TTeachingUnitsView.vue'),
            },
            {
                path: '/syllabus',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TSyllabusView.vue'),
            },
        ]
    },
    notFoundRoute,
];