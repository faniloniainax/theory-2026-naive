import type { Login, User } from "@/types/auth";
import useStorage from "./useStorage";
import useHttp from "./useHttp";
import type { Class } from "@/types/class";

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
        const p = { "check_delegate": checkDelegate };
        const r = await http.post("/auth/login", user, { params: p });

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

    function getClass(): null | Class {
        const user = loadDecrypted("_");

        if (!user || !user["class"])
            return null;

        return user["class"];
    }

    return ({
        tryToLoadUser,
        attemptToLogIn,
        attemptToLogOut,
        makeInitialsAndName,
        clearCache,
        getClass,
    });
};