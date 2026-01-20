<template>
    <NLayout class="main-container">
        <NLayoutHeader bordered>
            <NFlex justify="space-between" align="center" class="header-space">
                <NFlex justify="center" align="center">
                    <NImage src="/logo.png" class="logo" />
                    <NPopover trigger="click" placement="left">
                        <template #trigger>
                            <NButton @click="onBurgerClick">
                                <NIcon>
                                    <MenuOutline />
                                </NIcon>
                            </NButton>
                        </template>
                        <NMenu :options="options" :value="selectedKey" @update:value="onMenuOptionClick" />
                    </NPopover>
                </NFlex>

                <NButton type="error" ghost @click="onLogOutClick">
                    <template #icon>
                        <LogOutOuline />
                    </template>
                    Se déconnecter
                </NButton>
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
import MenuOutline from 'vicons/ionicons-v5/MenuOutline.vue'
import LogOutOuline from 'vicons/ionicons-v5/LogOutOutline.vue'
import { useRoute, useRouter } from 'vue-router';
import { Auth } from '@/lib/auth';
import type { User } from '@/types/auth';
import { delegateNavigation } from '@/navigation/delegate';
import { type MenuMixedOption } from 'naive-ui/lib/menu/src/interface';
import { useDialog, useMessage } from 'naive-ui';

const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const message = useMessage();

const options = ref<MenuMixedOption[]>([]);
const selectedKey = computed(() => route.path)

const showMenuDrawer = ref(false);

const onBurgerClick = () => {
    showMenuDrawer.value = true;
};

const onMenuOptionClick = (key: string) => {
    showMenuDrawer.value = false;
    router.push(key);
};

const onLogOutClick = () => {
    dialog.error({
        content: "Voulez-vous vraiment vous déconnecter ?",
        positiveText: "Confirmer",
        negativeText: "Annuler",
        onPositiveClick: async () => {
            await Auth.attemptLogOut();
            message.success("Déconnexion réussie.");
        },
    });
};

onMounted(async () => {
    const [data, isValid] = await Auth.isValid();

    if (!isValid)
        options.value = [];

    const user = data as User;

    // TODO: Fix these
    if (user['type'] === 'admin')
        options.value = [];
    else if (user['type'] === 'mention')
        options.value = [];
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
