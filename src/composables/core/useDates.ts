import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function useDates() {
    const locale = fr;

    function getCurrentYear(): number {
        return new Date().getFullYear();
    }

    function formatTSToUTC(ts: number): Date {
        const d = new Date(ts);
        return new Date(Date.UTC(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
        ));
    }

    function formatToTS(value: string): number {
        return new Date(value).getTime();
    }

    function formatDate(date: string | number | Date, fmt: string) {
        return format(date, fmt, { locale });
    }

    return ({
        getCurrentYear,
        formatTSToUTC,
        formatToTS,
        formatDate,
    });
};