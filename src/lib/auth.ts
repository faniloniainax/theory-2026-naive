import type { Login, User } from "@/types/auth";
import { Http } from "./http";
import { ErrorKind } from "./errors";
import { Routes } from "./routes";

const storeUserObject = (iName: string, u?: User) => {
    const s = u ? JSON.stringify(u) : "{}";
    const encrypted = btoa(s);

    localStorage.setItem(iName, encrypted);
};

const loadUserObject = (iName: string): User | undefined => {
    const encrypted = localStorage.getItem(iName);
    const decrypted = encrypted ? atob(encrypted) : "{}";

    return JSON.parse(decrypted) as (User | undefined);
};

export const Auth = {
    itemName: "_",
    async isValid() {
        let data = loadUserObject(this.itemName);

        if (!data?.email || !data?.name || !data?.token || !data?.type) {
            storeUserObject(this.itemName, undefined);
            return [null, false];
        }

        const res = await Http.post("/auth/is_valid", data);

        if (res.status !== 200) {
            storeUserObject(this.itemName, undefined);
            return [null, false];
        }

        return [data, true];
    },
    async attemptLogin(data: Login) {
        const res = await Http.post("/auth/login", data);

        if (res.status !== 200)
            throw { type: ErrorKind.SERVER_ERROR };

        storeUserObject(this.itemName, res.data as User);
        await Routes.replaceRoutesProperly(true);
    },
    async attemptLogOut() {
        localStorage.clear();
        storeUserObject(this.itemName, undefined);
        await Routes.replaceRoutesProperly(true);
    }
};