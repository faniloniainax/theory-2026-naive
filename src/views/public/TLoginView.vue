<template>
    <NFlex justify="center" align="center">
        <NCard bordered embedded segmented class="login-card">
            <TLoginCardBody @form:submit="onFormSubmit" />
        </NCard>
    </NFlex>
</template>


<script setup lang="ts">
import useAuth from '@/composables/core/useAuth';
import useRoutes from '@/composables/core/useRoutes';

import type { Login } from '@/types/auth';
import { useLoadingBar, useMessage } from 'naive-ui';

const message = useMessage();
const loadingBar = useLoadingBar();
const { attemptToLogIn } = useAuth();
const { useTypeDependentRoutes } = useRoutes();

const onFormSubmit = async (user: Login) => {
    try {
        loadingBar.start();

        await attemptToLogIn(user);
        await useTypeDependentRoutes(true);

        loadingBar.finish();
        message.success("Connexion réussie.");
    } catch (e: any) {
        loadingBar.error();
        if (e?.error)
            message.error(e.error);
        else
            message.error("Une erreur inattendue a été rencontrée.");
    }
};
</script>

<style scoped>
.login-card {
    width: min(1024px, 82vw);
    max-width: min(92vw, 85vw);
}
</style>