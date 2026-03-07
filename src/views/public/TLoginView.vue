<template>
    <NCard bordered embedded segmented>
        <template #header>
            <NFlex align="center">
                <NH2>Connexion</NH2>
            </NFlex>
            <NSpace justify="center">
                <NP :depth="3">
                    Application pour le suivi des enseignements.
                </NP>
            </NSpace>
        </template>

        <template #header-extra>
            <TMobileLogo />
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

        await attemptToLogIn(userData, true);
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