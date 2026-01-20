<template>
    <NLayout>
        <NLayoutContent>
            <NSpace class="main-space" align="center" justify="center">
                <RouterView />
            </NSpace>
        </NLayoutContent>
    </NLayout>

    <TFloatingCopyright />
</template>

<style scoped>
.main-container {
    width: 100vw;
    height: 100vh;
}

.main-space {
    width: 100vw;
    height: 100vh;
}
</style>
