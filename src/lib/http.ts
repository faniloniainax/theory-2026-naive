import { Axios } from "axios";
import { ErrorKind } from "./errors";
import { Store } from "./store";
import type { User } from "@/types/auth";

const Http = new Axios({
    baseURL: import.meta.env['VITE_API_URL'],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

Http.interceptors.request.use(
    (config) => {
        const user = Store.decryptLoad<User>("_");

        config.headers = config.headers ?? {}

        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        config.headers['X-Type'] ??= user?.type;
        config.headers['X-Token'] ??= user?.token;

        if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData))
            config.data = JSON.stringify(config.data);

        return config;
    },
    (error) => Promise.reject({ type: ErrorKind.UNKNOWN_ERROR, error: error })
);

Http.interceptors.response.use(
    (response) => {
        if (typeof response.data === 'string')
            response.data = JSON.parse(response.data);

        return response;
    },
    (error) => {
        if (!error.response)
            return Promise.reject({
                type: ErrorKind.NETWORK_ERROR,
                error: error,
            })
        if (error.response?.data)
            return Promise.reject({
                type: ErrorKind.UNKNOWN_ERROR,
                error: error,
            });

        return Promise.reject({
            type: ErrorKind.UNKNOWN_ERROR,
            error: error,
        });
    }
);

export { Http };