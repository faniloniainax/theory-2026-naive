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
            <TLoginForm @submit="onFormSubmit" />
        </template>
    </NCard>
</template>

<script setup lang="ts">
import useAuth from '@/composables/core/useAuth';
import useRoutes from '@/composables/core/useRoutes';
import type { Login } from '@/types/auth';
import { useLoadingBar, useMessage } from 'naive-ui';

const message = useMessage();
const loadingBar = useLoadingBar();
const { attemptToLogIn } = useAuth();
const { useDelegateRoutes } = useRoutes();

async function onFormSubmit(userData: Login) {
    try {
        loadingBar.start();

        await attemptToLogIn(userData);
        await useDelegateRoutes(true);

        loadingBar.finish();
        message.success("Connexion réussie.");
    } catch (e: any) {
        loadingBar.error();
        if (e?.error)
            message.error(e.error);
        else
            message.error("Une erreur inattendu a été rencontrée.");
    }
}
</script>