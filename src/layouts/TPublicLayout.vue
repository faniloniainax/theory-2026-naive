<template>
    <NLayout class="main-container">
        <NLayoutContent>
            <NSpace class="main-space" align="center" justify="center">
                <RouterView />
            </NSpace>
        </NLayoutContent>
    </NLayout>

    <TFloatingCopyright />
</template>

<script setup lang="ts">
type Emits = {
    (event: 'toggle:theme', isDark: boolean): void;
};

const emits = defineEmits<Emits>();
</script>

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