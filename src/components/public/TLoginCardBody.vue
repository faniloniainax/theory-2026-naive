<template>
    <NSpace vertical justify="space-between">
        <NSpace align="center" justify="center">
            <NImage alt="ENI Logo" src="/logo.png" class="logo" />
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

<style scoped>
.logo {
    width: min(30vh, 256px);
    height: min(30vh, 256px);
}
</style>