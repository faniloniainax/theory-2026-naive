import type { Login, User } from "@/types/auth";
import useStorage from "./useStorage";
import useHttp from "./useHttp";

export default function useAuth() {
    const { http } = useHttp();
    const { storeRaw, storeEncrypted, loadRaw, loadDecrypted, clearStorage } = useStorage<User>();

    async function tryToLoadUser(): Promise<[User | null, boolean]> {
        const user = loadDecrypted("_");

        if (!user?.email || !user.name || !user.token || !user.type) {
            storeEncrypted("_", undefined);
            return [null, false];
        }

        const r = await http.post("/auth/is_valid", user);
        if (r.status !== 200) {
            storeEncrypted("_", undefined);
            return [null, false];
        }

        return [user, true];
    }

    async function attemptToLogIn(user: Login, checkDelegate: boolean = false) {
        const r = await http.post("/class-credentials/check", user);

        if (r.status !== 200)
            throw r.data;

        storeEncrypted("_", r.data);
    }

    function attemptToLogOut() {
        clearStorage();
        storeEncrypted("_", undefined);
    }

    function makeInitialsAndName(): [string, string] {
        const user = loadDecrypted("_");

        if (!user || user['name'].length == 0)
            return ['-', '...'];

        return [
            user.name.slice(0, 3).toUpperCase(),
            user.name,
        ];
    }

    function clearCache() {
        const rawUser = loadRaw("_");
        const rawTheme = loadRaw("theme");

        clearStorage();
        storeRaw("_", rawUser ?? "");
        storeRaw("theme", rawTheme ?? "light");
    }

    return ({
        tryToLoadUser,
        attemptToLogIn,
        attemptToLogOut,
        makeInitialsAndName,
        clearCache,
    });
};