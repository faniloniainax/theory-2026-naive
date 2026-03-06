<template>
    <NLayout class="main-container">
        <NLayoutHeader bordered>
            <NFlex justify="space-between" align="center" class="header-space">
                <NFlex justify="center" align="center">
                    <NImage height="32" width="32" src="/logo.png" />
                </NFlex>
            </NFlex>
        </NLayoutHeader>
    </NLayout>

    <TFloatingCopyright />
</template>

<script setup lang="ts">
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