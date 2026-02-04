import { Axios } from "axios";
import useStorage from "./useStorage";
import type { User } from "@/types/auth";

/**
 * Composable for HTTP requests.
 */
export default function useHttp() {
    const http = new Axios({
        baseURL: import.meta.env['VITE_API_URL'],
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    http.interceptors.request.use(
        (config) => {
            const { loadDecrypted } = useStorage<User>();
            const user = loadDecrypted("_");

            config.headers = config.headers ?? {};
            config.headers['Accept'] = 'application/json';
            config.headers['Content-Type'] = 'application/json';
            config.headers['X-Type'] ??= user?.type;
            config.headers['X-Token'] ??= user?.token;

            if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData))
                config.data = JSON.stringify(config.data);

            return config;
        },
        // TODO: Handle errors better
        (error) => Promise.reject(error),
    );

    http.interceptors.response.use(
        (response) => {
            if (typeof response.data === 'string')
                response.data = JSON.parse(response.data);

            return response;
        },
        // TODO: Handle errors better
        (error) => Promise.reject(error),
    )

    return ({
        http,
    });
};