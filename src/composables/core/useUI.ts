import { type InjectedMessage, type InjectedLoadingBar } from "@/types/reporting";
import { useLoadingBar, useMessage } from "naive-ui";

let loadingBar = ref<InjectedLoadingBar | null>(null);
let message = ref<InjectedMessage | null>(null);

function toggleFeature<T>(yes: boolean | undefined, subject: Ref<T | null>, feature: () => T) {
    if (yes)
        subject.value = feature();
    else
        subject.value = null;
}

export default function useUI(config: {
    loadingBar?: boolean;
    message?: boolean;
}) {
    toggleFeature(config.loadingBar, loadingBar, useLoadingBar);
    toggleFeature(config.message, message, useMessage);
};