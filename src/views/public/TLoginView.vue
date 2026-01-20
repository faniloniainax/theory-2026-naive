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
import { useMessage } from 'naive-ui';

const message = useMessage();

const onFormSubmit = async (data: Login) => {
    try {
        await Auth.attemptLogin(data);
    } catch (e) {
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