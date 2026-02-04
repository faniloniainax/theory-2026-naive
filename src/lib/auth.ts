import type { Login, User } from "@/types/auth";
import { Http } from "./http";
import { ErrorKind } from "./errors";
import { Routes } from "./routes";
import { Store } from "./store";

export const Auth = {
    async isValid() {
        let data = Store.decryptLoad<User>("_");

        if (!data?.email || !data?.name || !data?.token || !data?.type) {
            Store.encryptStore<User>("_", undefined);
            return [null, false];
        }

        const res = await Http.post("/auth/is_valid", data);

        if (res.status !== 200) {
            Store.encryptStore<User>("_", undefined);
            return [null, false];
        }

        return [data, true];
    },
    async attemptLogin(data: Login) {
        const res = await Http.post("/auth/login", data);

        if (res.status !== 200)
            throw { type: ErrorKind.SERVER_ERROR };

        Store.encryptStore<User>("_", res.data as User);
        await Routes.replaceRoutesProperly(true);
    },
    async attemptLogOut() {
        Store.clear();
        Store.encryptStore<User>("_", undefined);
        await Routes.replaceRoutesProperly(true);
    },
    getInitialsAndName() {
        const user = Store.decryptLoad<User>("_");

        if (!user || user.name.length == 0)
            return ["-", "..."];

        return [user.name.slice(0, 3), user.name];
    },
    emptyCache() {
        const user = Store.rawLoad("_");
        Store.clear();
        Store.rawStore("_", user ?? "");
    },
};