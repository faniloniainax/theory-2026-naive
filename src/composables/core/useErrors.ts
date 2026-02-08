import type { InjectedLoadingBar, InjectedMessage } from "@/types/reporting";

export default function useErrors(l?: InjectedLoadingBar, m?: InjectedMessage) {
    function reportError(e: any, defaultMessage = "Une erreur inattendue a été rencontrée", writeToConsole: boolean = true) {
        let message = defaultMessage;

        if (e && e.error)
            message = e.error;
        else if (e && e.message)
            message = e.message;

        l?.error();
        m?.error(message);

        if (writeToConsole)
            console.error(e);
    }

    return ({
        reportError,
    });
}