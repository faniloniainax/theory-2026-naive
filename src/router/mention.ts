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
                component: () => import('@/views/mention/TLogbookView.vue'),
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
            {
                path: '/contacts',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TContactsView.vue'),
            },
            {
                path: '/unavailabilities',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TUnavailabilitiesView.vue'),
            },
            {
                path: '/semesters',
                meta: { layout: TMainLayout },
                component: () => import('@/views/mention/TSemestersView.vue'),
            },
        ]
    },
    notFoundRoute,
];