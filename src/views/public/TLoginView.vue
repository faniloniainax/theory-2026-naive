<template>
    <NFlex justify="center" align="center" class="main-container">
        <NCard bordered embedded segmented class="login-card">
            <TLoginCardBody @form:submit="onFormSubmit" />
        </NCard>
    </NFlex>
</template>


<script setup lang="ts">
import { ErrorKind, Errors } from '@/lib/errors';
import { Http } from '@/lib/http';
import type { Login } from '@/types/auth';
import { useMessage } from 'naive-ui';

const message = useMessage();

const onFormSubmit = async (data: Login) => {
    try {
        const res = await Http.post("/auth/login", data);

        if (res.status !== 200)
            throw { type: ErrorKind.SERVER_ERROR };
    } catch (e) {
        message.error(Errors.getErrorMessage((e as any).type));
    }
};
</script>

<style scoped>
.main-container {
    padding-top: 20px;
}

.login-card {
    width: min(1024px, 82vw);
    max-width: min(92vw, 85vw);
}
</style>