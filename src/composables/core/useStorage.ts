/**
 * Composable to make localStorage
 * use centralized within the project.
 */
export default function useStorage<T>() {
    /**
     * Stores the value t at the
     * name position.
     * 
     * @param name 
     * @param t 
     */
    function store(name: string, t?: T) {
        const json = t ? JSON.stringify(t) : "{}";
        storeRaw(name, json);
    }

    /**
     * Stores a raw string at
     * the name position.
     * 
     * @param name
     * @param value 
     */
    function storeRaw(name: string, value: string) {
        localStorage.setItem(name, value);
    }

    /**
     * Stores an object to
     * encrypt at the name position.
     * 
     * @param name 
     * @param t 
     */
    function storeEncrypted(name: string, t?: T) {
        const json = t ? JSON.stringify(t) : "{}";
        const base64 = btoa(json);
        storeRaw(name, base64);
    }

    /**
     * Loads an object from the
     * name position.
     * 
     * @param name 
     * @returns 
     */
    function load(name: string): T | null {
        const json = loadRaw(name);
        return json ? JSON.parse(json) as T : null;
    }

    /**
     * Loads a raw value from the
     * name position.
     * 
     * @param name 
     * @returns 
     */
    function loadRaw(name: string): string | null {
        return localStorage.getItem(name);
    }

    /**
     * Loads a decryped object
     * from the name position.
     * 
     * @param name 
     * @returns 
     */
    function loadDecrypted(name: string): T | null {
        const base64 = loadRaw(name);

        if (!base64 || base64.length == 0)
            return null;

        const json = atob(base64);
        return JSON.parse(json) as T;
    }

    return ({
        store,
        storeRaw,
        storeEncrypted,
        load,
        loadRaw,
        loadDecrypted,
    });
};