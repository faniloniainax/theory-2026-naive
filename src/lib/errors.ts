export enum ErrorKind {
    NO_ERROR,
    SERVER_ERROR,
    NETWORK_ERROR,
    UNKNOWN_ERROR,
};

export const Errors = {
    deduceErrorKind(k: number): ErrorKind {
        if (k >= ErrorKind.UNKNOWN_ERROR)
            return ErrorKind.UNKNOWN_ERROR;
        if (k <= ErrorKind.NO_ERROR)
            return ErrorKind.NO_ERROR;

        return k as ErrorKind;
    },
    getErrorMessage(k: ErrorKind): string {
        const errorMessages = new Map<ErrorKind, string>([
            [ErrorKind.NO_ERROR, "Aucune erreur."],
            [ErrorKind.SERVER_ERROR, "Une erreur interne du serveur a été rencontrée."], // TODO: Improve server error reporting.
            [ErrorKind.NETWORK_ERROR, "Une erreur de réseau a été rencontrée."],
            [ErrorKind.UNKNOWN_ERROR, "Une erreur inconnue a été rencontrée."],
        ]);

        return errorMessages.get(k)!
    },
};