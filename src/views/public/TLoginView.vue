<template>
    <NFlex justify="center" align="center">
        <NCard bordered embedded segmented class="login-card">
            <TLoginCardBody @form:submit="onFormSubmit" />
        </NCard>
    </NFlex>
</template>


<script setup lang="ts">
import { Auth } from '@/lib/auth';
import { ErrorKind, Errors } from '@/lib/errors';
import { Http } from '@/lib/http';
import type { Login } from '@/types/auth';
import { useLoadingBar, useMessage } from 'naive-ui';

const message = useMessage();
const loadingBar = useLoadingBar();

const onFormSubmit = async (data: Login) => {
    try {
        loadingBar.start();
        await Auth.attemptLogin(data);
        loadingBar.finish();
        message.success("Connexion réussie.");
    } catch (e) {
        loadingBar.error();
        message.error(Errors.getErrorMessage((e as any).type));
    }
};
</script>

<style scoped>
.login-card {
    width: min(1024px, 82vw);
    max-width: min(92vw, 85vw);
}
</style>