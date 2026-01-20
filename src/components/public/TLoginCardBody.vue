<template>
    <NSpace vertical justify="space-between">
        <NSpace align="center" justify="center">
            <NImage alt="ENI Logo" src="/logo.png" width="256" height="256" />
        </NSpace>
        <NDivider />
        <NH2>Connexion</NH2>
        <TLoginForm @submit="onFormSubmit" />
    </NSpace>
</template>

<script setup lang="ts">
import type { Login } from '@/types/auth';

type Emits = {
    (event: 'form:submit', data: Login): void;
};

const emits = defineEmits<Emits>();

const onFormSubmit = (data: Login) => {
    emits('form:submit', data);
};
</script>