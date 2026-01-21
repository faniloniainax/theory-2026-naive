export const Dates = {
    getCurrentYear(): number {
        return new Date().getFullYear();
    },
    toUTCMidnight(ts: number): string {
        const d = new Date(ts);
        return new Date(Date.UTC(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
        )).toISOString();
    },
    getTimeStamp(value: string) {
        return new Date(value).getTime();
    },
};