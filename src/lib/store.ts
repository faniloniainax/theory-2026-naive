export const Store = {
    encryptStore<T>(n: string, t?: T) {
        const json = t ? JSON.stringify(t) : "{}";
        const base64 = btoa(json);
        this.rawStore(n, base64);
    },
    store<T>(n: string, t?: T) {
        const json = t ? JSON.stringify(t) : "{}";
        this.rawStore(n, json);
    },
    rawStore(n: string, s: string) {
        localStorage.setItem(n, s);
    },
    decryptLoad<T>(n: string): T | null {
        const base64 = this.rawLoad(n);

        if (!base64 || base64.length == 0)
            return null;

        const json = atob(base64);
        return JSON.parse(json) as T;
    },
    load<T>(n: string): T | null {
        const json = this.rawLoad(n);
        return json ? JSON.parse(json) as T : null;
    },
    rawLoad(n: string): string | null {
        return localStorage.getItem(n);
    },
};