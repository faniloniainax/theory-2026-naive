import { useLoadingBar, useMessage } from "naive-ui";

export default function useLoading() {
    const loadingBar = useLoadingBar();

    function runLoading(fn: () => boolean, errMessage?: string) {
        loadingBar.start();
        try {
            const ok = fn();
            if (!ok)
                throw Error(errMessage ?? "Une erreur inattendue s'est produite.");
            loadingBar.finish();
        } catch (e) {
            loadingBar.error();
        }
    }

    async function runAsyncLoading(fn: () => Promise<boolean>, errMessage?: string) {
        loadingBar.start();
        try {
            const ok = await fn();
            if (!ok)
                throw Error(errMessage ?? "Une erreur inattendue s'est produite.");
            loadingBar.finish();
        } catch (e) {
            loadingBar.error();
        }
    }

    return ({
        runLoading,
        runAsyncLoading,
    });
}