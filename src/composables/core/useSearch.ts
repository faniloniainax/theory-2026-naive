export default function useSearch() {
    function debounceAsync<T, A extends any[]>(
        fn: (...args: A) => Promise<T>,
        delay: number = 300
    ) {
        let timeoutId: number | null = null;
        let lastReject: ((reason?: any) => void) | null = null;

        return (...args: A): Promise<T> => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }

            return new Promise<T>((resolve, reject) => {
                lastReject = reject;

                timeoutId = window.setTimeout(async () => {
                    try {
                        const result = await fn(...args);
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                }, delay);
            });
        };
    }

    return ({
        debounceAsync,
    });
}