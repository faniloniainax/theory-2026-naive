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
                        <NMenu :options="options" :value="selectedKey" @update:value="onMenuOptionClick" />
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
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const selectedKey = computed(() => route.path)

const showMenuDrawer = ref(false);

const options: MenuMixedOption[] = [
    {
        key: '/home',
        label: 'Accueil',
    },
    {
        key: '/logbook',
        label: 'Cahier de texte',
    },
    {
        key: '/calendar',
        label: 'Calendrier',
    },
];

const onBurgerClick = () => {
    showMenuDrawer.value = true;
};

const onMenuOptionClick = (key: string) => {
    showMenuDrawer.value = false;
    router.push(key);
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
