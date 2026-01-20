<template>
    <NLayout class="main-layout">
        <NLayoutContent>
            <RouterView />
        </NLayoutContent>
    </NLayout>

    <TFloatingCopyright />
</template>

<style scoped>
.main-layout {
    width: 100vw;
    height: 100vh;
}
</style>