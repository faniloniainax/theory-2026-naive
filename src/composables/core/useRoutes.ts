import useAuth from "./useAuth";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { publicRoutes } from "@/router/public";
import { delegateRoutes } from "@/router/delegate";
import { mentionRoutes } from "@/router/mention";

export default function useRoutes() {
    const { tryToLoadUser } = useAuth();
    const router = createRouter({
        history: createWebHistory(import.meta.env['BASE_URL']),
        routes: [],
    });

    function useNewRoutes(newRoutes: RouteRecordRaw[]) {
        router.clearRoutes();
        newRoutes.forEach(r => router.addRoute(r));
    }

    async function getTypeDependentRoutes() {
        const [user, ok] = await tryToLoadUser();

        if (!ok || !user)
            return publicRoutes;
        if (user['type'] === 'admin')
            return publicRoutes;
        else if (user['type'] === 'mention')
            return mentionRoutes;

        return delegateRoutes;
    }

    async function useTypeDependentRoutes(pushToRoot: boolean = false) {
        const routes = await getTypeDependentRoutes();

        useNewRoutes(routes);
        if (pushToRoot)
            router.push("/");
    }

    return ({
        router,
        useNewRoutes,
        getTypeDependentRoutes,
        useTypeDependentRoutes,
    });
};