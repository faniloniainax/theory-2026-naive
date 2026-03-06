<template>
    <NCard bordered embedded segmented>
        <template #header>
            <NSpace justify="center">
                <NImage height="32" width="32" alt="ENI Logo" src="/logo.png" />
                <NH2>Connexion</NH2>
            </NSpace>
            <NSpace justify="center">
                <NP :depth="3">
                    Application de suivi des enseignements
                </NP>
            </NSpace>
        </template>

        <template #default>
            <TLoginForm />
        </template>

        <template #footer>

        </template>
    </NCard>
</template>

<script setup lang="ts">
</script>