<template>
    <NLayout class="main-container">
        <NLayoutHeader bordered>
            <NFlex justify="space-between" align="center" class="header-space">
                <NFlex justify="center" align="center">
                    <NImage src="/logo.png" class="logo" />
                    <NPopover trigger="click" placement="left">
                        <template #trigger>
                            <NButton @click="onBurgerClick">
                                <NIcon size="large">
                                    <MenuOutline />
                                </NIcon>
                            </NButton>
                        </template>
                        <NMenu :options="options" :value="selectedKey" @update:value="onMenuOptionClick" />
                    </NPopover>
                </NFlex>

                <NPopover trigger="click" placement="right">
                    <template #trigger>
                        <NButton>
                            <NIcon size="large">
                                <AccountOutline />
                            </NIcon>
                        </NButton>
                    </template>

                    <NFlex vertical>
                        <NSpace align="center" justify="center">
                            <NAvatar size="large">{{ initials }}</NAvatar>
                            <NP :depth="3">{{ name }}</NP>
                        </NSpace>
                        <NSwitch :value="themeIsChecked" @update:value="onThemeSwitchValueUpdate">
                            <template #checked-icon>
                                <NIcon>
                                    <MoonOutline />
                                </NIcon>
                            </template>
                            <template #checked>
                                Sombre
                            </template>
                            <template #unchecked-icon>
                                <NIcon>
                                    <SunnyOutline />
                                </NIcon>
                            </template>
                            <template #unchecked>
                                Clair
                            </template>
                        </NSwitch>
                        <NButton ghost type="warning" @click="onEmptyCacheClick">
                            <NIcon>
                                <TrashBinOutline />
                            </NIcon>
                            Vider le cache
                        </NButton>
                        <NButton ghost type="error" @click="onLogOutClick">
                            <NIcon>
                                <LogOutOutline />
                            </NIcon>
                            Se déconnecter
                        </NButton>
                    </NFlex>
                </NPopover>
            </NFlex>
        </NLayoutHeader>
        <NLayoutContent>
            <NFlex class="main-space" justify="center" align="stretch">
                <RouterView />
            </NFlex>
        </NLayoutContent>
    </NLayout>

    <TFloatingCopyright />
</template>

<script setup lang="ts">
import useAuth from '@/composables/core/useAuth'
import useRoutes from '@/composables/core/useRoutes'
import MenuOutline from 'vicons/ionicons-v5/MenuOutline.vue'
import LogOutOutline from 'vicons/ionicons-v5/LogOutOutline.vue'
import TrashBinOutline from 'vicons/ionicons-v5/TrashBinOutline.vue'
import AccountOutline from 'vicons/fluent/PersonAccounts24Regular.vue'
import SunnyOutline from 'vicons/ionicons-v5/SunnyOutline.vue'
import MoonOutline from 'vicons/ionicons-v5/MoonOutline.vue'
import { useRoute, useRouter } from 'vue-router';
import type { User } from '@/types/auth';
import { delegateNavigation } from '@/navigation/delegate';
import { type MenuMixedOption } from 'naive-ui/lib/menu/src/interface';
import { useDialog, useMessage } from 'naive-ui';
import { mentionNavigation } from '@/navigation/mention';
import useStorage from '@/composables/core/useStorage'

const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const message = useMessage();
const { makeInitialsAndName, clearCache, attemptToLogOut, tryToLoadUser, } = useAuth();
const { useTypeDependentRoutes } = useRoutes();

const options = ref<MenuMixedOption[]>([]);
const selectedKey = computed(() => route.path);
const [initials, name] = makeInitialsAndName();

const showMenuDrawer = ref(false);
const themeIsChecked = computed(() => {
    const { loadRaw, storeRaw } = useStorage();
    let theme = loadRaw("theme");

    if (!theme) {
        theme = "light";
        storeRaw("theme", theme);
    }

    return theme === 'dark';
});

const onBurgerClick = () => {
    showMenuDrawer.value = true;
};

const onMenuOptionClick = (key: string) => {
    showMenuDrawer.value = false;
    router.push(key);
};

const onEmptyCacheClick = () => {
    dialog.warning({
        content: 'Voulez-vous vraiment vider le cache ?',
        positiveText: "Confirmer",
        negativeText: "Annuler",
        onPositiveClick: () => {
            clearCache();
            message.success("Cache vidé.");
        },
    });
};

const onLogOutClick = () => {
    dialog.error({
        content: "Voulez-vous vraiment vous déconnecter ?",
        positiveText: "Confirmer",
        negativeText: "Annuler",
        onPositiveClick: () => {
            attemptToLogOut();
            useTypeDependentRoutes(true);
            message.success("Déconnexion réussie.");
        },
    });
};

const onThemeSwitchValueUpdate = (isChecked: boolean) => {
    const { loadRaw, storeRaw } = useStorage();
    const { router } = useRoutes();

    if (isChecked)
        storeRaw("theme", "dark");
    else
        storeRaw("theme", "light");

    router.go(0);
};

onMounted(async () => {
    const [user, ok] = await tryToLoadUser();

    if (!ok || !user) {
        options.value = [];
        return;
    }

    // TODO: Fix these
    if (user['type'] === 'admin')
        options.value = [];
    else if (user['type'] === 'mention')
        options.value = mentionNavigation;
    else
        options.value = delegateNavigation;
});
</script>

<style scoped>
.main-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.header-space {
    padding: 10px;
}

.main-space {
    flex: 1;
    padding: 20px;
}

.logo {
    width: min(10vh, 64);
    height: min(10vh, 64px);
}
</style>
