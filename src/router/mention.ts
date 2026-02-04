import type { RouteRecordRaw } from "vue-router";
import { notFoundRoute } from "./misc";
import TMainLayout from "@/layouts/TMainLayout.vue";

export const mentionRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/activity',
        meta: { layout: TMainLayout },
        children: [
            {
                path: '/activity',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TActivityView.vue'),
            },
            {
                path: '/progress',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TProgressView.vue'),
            },
            {
                path: '/allocated-hours',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/program/TAllocatedHoursView.vue'),
            },
            {
                path: '/rooms',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/repartition/TRoomsView.vue'),
            },
            {
                path: '/classes',
                meta: { layout: TMainLayout },
                component: () => import("@/views/mention/repartition/TClassesView.vue"),
            },
            {
                path: '/const-elements',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/program/TConstElementsView.vue'),
            },
            {
                path: '/courses',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TCoursesView.vue'),
            },
            {
                path: '/teachers',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/repartition/TTeachersView.vue'),
            },
            {
                path: '/hour-parts',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/repartition/THourPartsView.vue'),
            },
            {
                path: '/teaching-units',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/program/TTeachingUnitsView.vue'),
            },
            {
                path: '/syllabus',
                meta: { layout: TMainLayout },
                // component: () => import('@/views/mention/TSyllabusView.vue'),
                component: () => import('@/views/public/TInConstruction.vue'),
            },
            {
                path: '/contacts',
                meta: { layout: TMainLayout },
                // component: () => import('@/views/mention/TContactsView.vue'),
                component: () => import('@/views/public/TInConstruction.vue'),
            },
            {
                path: '/unavailabilities',
                meta: { layout: TMainLayout },
                // component: () => import('@/views/mention/TUnavailabilitiesView.vue'),
                component: () => import('@/views/public/TInConstruction.vue'),
            },
            {
                path: '/semesters',
                meta: { layout: TMainLayout },
                // component: () => import('@/views/mention/TSemestersView.vue'),
                component: () => import('@/views/public/TInConstruction.vue'),
            },
        ]
    },
    notFoundRoute,
];