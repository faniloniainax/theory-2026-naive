<template>
    <NPopover trigger="click" placement="right">
        <template #trigger>
            <NButton circle>
                <template #icon>
                    <NIcon>
                        <PersonCircleOutline />
                    </NIcon>
                </template>
            </NButton>
        </template>

        <template #default>
            <NFlex vertical>
                <!-- Avatar + Username -->
                <NSpace align="center" justify="center">
                    <NAvatar size="large">{{ initials }}</NAvatar>
                    <NP :depth="3">{{ name }}</NP>
                </NSpace>

                <!-- Theme toggle -->
                <NSwitch :value="isDarkTheme" @update-value="onThemeToggle">
                    <template #checked-icon>
                        <NIcon>
                            <MoonOutline />
                        </NIcon>
                    </template>
                    <template #unchecked-icon>
                        <NIcon>
                            <SunnyOutline />
                        </NIcon>
                    </template>
                </NSwitch>

                <!-- Empty cache button -->
                <NButton ghost type="warning" @click="onEmptyCacheClick">
                    <template #icon>
                        <NIcon>
                            <TrashBinOutline />
                        </NIcon>
                    </template>
                    Vider le cache
                </NButton>

                <!-- Log out button -->
                <NButton ghost type="error" @click="onLogOutClick">
                    <template #icon>
                        <NIcon>
                            <LogOutOutline />
                        </NIcon>
                    </template>
                    Se déconnecter
                </NButton>
            </NFlex>
        </template>
    </NPopover>
</template>

<script setup lang="ts">
import useAuth from '@/composables/core/useAuth';
import useRoutes from '@/composables/core/useRoutes';
import useStorage from '@/composables/core/useStorage';
import { useDialog, useMessage } from 'naive-ui';
import LogOutOutline from 'vicons/ionicons-v5/LogOutOutline.vue';
import MoonOutline from 'vicons/ionicons-v5/MoonOutline.vue';
import PersonCircleOutline from 'vicons/ionicons-v5/PersonCircleOutline.vue';
import SunnyOutline from 'vicons/ionicons-v5/SunnyOutline.vue';
import TrashBinOutline from 'vicons/ionicons-v5/TrashBinOutline.vue';

type Emits = {
    (event: 'toggle:theme', isDark: boolean): void;
};

const emits = defineEmits<Emits>();

const dialog = useDialog();
const message = useMessage();
const { useTypeDependentRoutes } = useRoutes();
const { makeInitialsAndName, clearCache, attemptToLogOut } = useAuth();

const [initials, name] = makeInitialsAndName();
const isDarkTheme = ref<boolean>();

function getIsDark() {
    const { loadRaw, storeRaw } = useStorage();
    let theme = loadRaw("theme");

    if (!theme) {
        theme = "light";
        storeRaw("theme", theme);
    }

    return theme === 'dark';
}

function onThemeToggle(isDark: boolean) {
    const { storeRaw } = useStorage();

    isDarkTheme.value = isDark;
    if (isDark)
        storeRaw("theme", "dark");
    else
        storeRaw("theme", "light");

    emits("toggle:theme", isDark);
}

function onEmptyCacheClick() {
    dialog.warning({
        content: "Voulez-vous vraiment vider le cache de l'application ? Cette action est irréversible.",
        negativeText: "Annuler",
        positiveText: "Confirmer",
        onPositiveClick: () => {
            clearCache();
            message.success("Cache vidé avec succès.");
        },
    });
}

function onLogOutClick() {
    dialog.error({
        content: "Voulez-vous vraiment vous déconnecter ?",
        negativeText: "Annuler",
        positiveText: "Confirmer",
        onPositiveClick: () => {
            attemptToLogOut();
            useTypeDependentRoutes(true);
            message.success("Déconnexion réussie.");
        },
    });
}

onMounted(() => {
    isDarkTheme.value = getIsDark();
});
</script>