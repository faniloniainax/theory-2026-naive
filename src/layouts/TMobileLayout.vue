<template>
    <NLayout class="main-container">
        <NLayoutHeader bordered>
            <NFlex justify="space-between" align="center" class="header-space">
                <TMobileMenu :options="delegateNavigation" />
                <TMobileLogo />
                <TMobileSettings />
            </NFlex>
        </NLayoutHeader>
    </NLayout>

    <TFloatingCopyright />
</template>

<script setup lang="ts">
import { delegateNavigation } from '@/navigation/delegate';

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
</style>