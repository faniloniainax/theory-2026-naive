import useAuth from "./useAuth";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { publicRoutes } from "@/router/public";
import { delegateRoutes } from "@/router/delegate";
import { mentionRoutes } from "@/router/mention";

const router = createRouter({
    history: createWebHistory(import.meta.env['BASE_URL']),
    routes: [],
});

export default function useRoutes() {
    const { tryToLoadUser } = useAuth();

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

    async function useDelegateRoutes(pushToRoot: boolean) {
        useNewRoutes(delegateRoutes);
        if (pushToRoot)
            router.push("/");
    }

    return ({
        router,
        useNewRoutes,
        useDelegateRoutes,
        getTypeDependentRoutes,
        useTypeDependentRoutes,
    });
};