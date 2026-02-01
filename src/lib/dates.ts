import { formatDate } from "date-fns";
import { fr } from "date-fns/locale";

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
    format(date: string | Date | number, format: string) {
        return formatDate(date, format, { locale: fr });
    }
};