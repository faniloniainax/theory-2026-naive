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

const options: MenuMixedOption[] = [
    {
        key: 'burger_menu',
        icon: () => h(MenuOutline),
        children: [
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
        ]
    }
];

const onBurgerClick = () => {

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
