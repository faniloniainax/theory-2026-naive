import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { Auth } from "./auth";
import { publicRoutes } from "@/router/public";
import type { User } from "@/types/auth";
import { delegateRoutes } from "@/router/delegate";
import { mentionRoutes } from "@/router/mention";

export const router = createRouter({
    history: createWebHistory(import.meta.env['BASE_URL']),
    routes: [],
});

export const Routes = {
    replaceRoutes(newRoutes: RouteRecordRaw[]) {
        router.clearRoutes();
        newRoutes.forEach(route => {
            router.addRoute(route);
        });
    },
    async deduceRoutes() {
        const [data, isAuthValid] = await Auth.isValid();

        if (!isAuthValid)
            return publicRoutes;

        const userData = data as User;

        // TODO: Change this later...
        if (userData['type'] == 'admin')
            return publicRoutes;
        if (userData['type'] == 'mention')
            return mentionRoutes;

        return delegateRoutes;
    },
    async replaceRoutesProperly(pushRoot: boolean = false) {
        const routes = await this.deduceRoutes();
        this.replaceRoutes(routes);

        if (pushRoot)
            router.push("/");
    }
};