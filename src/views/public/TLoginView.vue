<template>
    <NCard bordered embedded segmented>
        <template #default>
            <TLoginCardBody @form:submit="onFormSubmit" />
        </template>

        <template #footer>
            <NSpace justify="center" align="center">
                <NP :depth="3">Copyright {{ Dates.getCurrentYear() }} - ENI</NP>
            </NSpace>
        </template>
    </NCard>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import type { Login } from '@/types/auth';

const onFormSubmit = (data: Login) => {
    console.log("Login data:", data);
};
</script>