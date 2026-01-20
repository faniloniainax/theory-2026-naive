<template>
    <NLayout class="main-container">
        <NLayoutHeader bordered>
            <NFlex justify="space-between" class="header-space">
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
import { useRoute, useRouter } from 'vue-router';
import { Auth } from '@/lib/auth';
import type { User } from '@/types/auth';
import { delegateNavigation } from '@/navigation/delegate';
import { type MenuMixedOption } from 'naive-ui/lib/menu/src/interface';

const route = useRoute();
const router = useRouter();

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
