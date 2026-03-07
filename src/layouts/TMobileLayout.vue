<template>
    <NLayout class="main-container">
        <NLayoutHeader bordered>
            <NFlex justify="space-between" align="center" class="header-space">
                <TMobileMenu :options="delegateNavigation" />
                <TMobileLogo />
                <TMobileSettings @toggle:theme="onThemeToggle" />
            </NFlex>
        </NLayoutHeader>
        <NFlex id="breadcrumbs-container" justify="center" align="center">
            <TBreadcrumbs />
        </NFlex>
        <NLayoutContent>
            <NFlex class="main-space" justify="center" align="stretch">
                <RouterView />
            </NFlex>
        </NLayoutContent>
    </NLayout>

    <TFloatingCopyright />
</template>

<script setup lang="ts">
import { delegateNavigation } from '@/navigation/delegate';

type Emits = {
    (event: 'toggle:theme', isDark: boolean): void;
};

const emits = defineEmits<Emits>();

function onThemeToggle(isDark: boolean) {
    emits('toggle:theme', isDark);
}
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

#breadcrumbs-container {
    padding-top: 4%;
}
</style>