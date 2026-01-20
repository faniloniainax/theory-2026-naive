import type { Login, User } from "@/types/auth";
import { Http } from "./http";
import { ErrorKind } from "./errors";
import { Routes } from "./routes";

export const Auth = {
    itemName: "__USER",
    async isValid() {
        let data = JSON.parse(localStorage.getItem("__USER") ?? "{}") as (User | undefined);

        if (!data?.email || !data?.name || !data?.token || !data?.type) {
            localStorage.setItem(this.itemName, "{}");
            return [null, false];
        }

        const res = await Http.post("/auth/is_valid", data);

        if (res.status !== 200) {
            localStorage.setItem(this.itemName, "{}");
            return [null, false];
        }

        return [data, true];
    },
    async attemptLogin(data: Login) {
        const res = await Http.post("/auth/login", data);

        if (res.status !== 200)
            throw { type: ErrorKind.SERVER_ERROR };

        const json = JSON.stringify(res.data);

        localStorage.setItem(this.itemName, json);
        await Routes.replaceRoutesProperly(true);
    },
    async attemptLogOut() {
        localStorage.setItem(this.itemName, "{}");
        await Routes.replaceRoutesProperly(true);
    }
};