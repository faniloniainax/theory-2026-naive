import { Axios } from "axios";
import { ErrorKind } from "./errors";

const Http = new Axios({
    baseURL: import.meta.env['VITE_API_URL'],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

Http.interceptors.request.use(
    (config) => {
        config.headers = config.headers ?? {}

        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';

        if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData))
            config.data = JSON.stringify(config.data);

        return config;
    },
    (error) => Promise.reject({ type: ErrorKind.UNKNOWN_ERROR, error: error })
);

Http.interceptors.response.use(
    (response) => response,
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