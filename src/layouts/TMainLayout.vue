<template>
    <NLayout>
        <NLayoutHeader bordered>
            <NSpace justify="space-between" class="header-space">
                <NFlex justify="center" align="center">
                    <NImage src="/logo.png" class="logo" />
                    <NButton type="primary" ghost @click="onBurgerClick">
                        <NIcon>
                            <MenuOutline />
                        </NIcon>
                    </NButton>
                </NFlex>

                <NDrawer v-model:show="showMenuDrawer" class="menu-drawer" placement="left" close-on-esc>
                    <NDrawerContent title="Menu principal" closable>
                        <NMenu :options="options" />
                    </NDrawerContent>
                </NDrawer>
            </NSpace>
        </NLayoutHeader>
        <NLayoutContent>
            <NSpace class="main-space" align="center" justify="center">
                <RouterView />
            </NSpace>
        </NLayoutContent>
    </NLayout>

    <TFloatingCopyright />
</template>

<script setup lang="ts">
import MenuOutline from 'vicons/ionicons-v5/MenuOutline.vue'
import type { MenuMixedOption } from 'naive-ui/lib/menu/src/interface';

const showMenuDrawer = ref(false);

const options: MenuMixedOption[] = [
    {
        key: 'home_menu',
        label: 'Accueil',
    },
    {
        key: 'logbook_menu',
        label: 'Cahier de texte',
    },
    {
        key: 'calendar_menu',
        label: 'Calendrier',
    },
];

const onBurgerClick = () => {
    showMenuDrawer.value = true;
};
</script>

<style scoped>
.main-container {
    width: 100vw;
    height: 100vh;
}

.header-space {
    padding: 10px;
}

.main-space {
    width: 100vw;
    height: 100vh;
}

.logo {
    width: min(10vh, 64);
    height: min(10vh, 64px);
}
</style>
