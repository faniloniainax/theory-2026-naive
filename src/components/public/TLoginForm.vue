<template>
    <NForm :rules="formRules" ref="formRef" :model="formValue">
        <NGrid :cols="1">
            <NFormItemGi label="Nom d'utilisateur ou adresse e-mail" path="identifier">
                <NInput placeholder="L1PRO1 ou _@gmail.com..." v-model:value="formValue['identifier']" />
            </NFormItemGi>

            <NFormItemGi label="Mot de passe" path="password">
                <NInput placeholder="m0Td3p4553..." type="password" show-password-toggle
                    v-model:value="formValue['password']" maxlength="30" />
            </NFormItemGi>
        </NGrid>

        <NSpace align="end" justify="end">
            <NSpace justify="space-between">
                <NButton type="error" ghost @click="onResetClick">Réinitialiser</NButton>
                <NButton type="success" @click="onSubmitClick">Se connecter</NButton>
            </NSpace>
        </NSpace>
    </NForm>
</template>

<script setup lang="ts">
import type { Login } from '@/types/auth';
import { type FormInst, type FormRules } from 'naive-ui';

type Emits = {
    (event: 'submit', data: Login): void;
};

const emits = defineEmits<Emits>();

const formRef = ref<FormInst | null>(null);
const formValue = ref<Login>({
    identifier: "",
    password: "",
});
const formRules: FormRules = {
    identifier: {
        type: 'string',
        required: true,
        max: 250,
        message: "L'identifiant est requis.",
        trigger: ['blur', 'input'],
    },
    password: [{
        type: 'string',
        required: true,
        message: "Le mot de passe est requis.",
        trigger: ['blur', 'input'],
    }, {
        type: 'string',
        max: 30,
        min: 8,
        message: "Le mot de passe doit être entre 8 et 30 caractères.",
        trigger: ['blur', 'input'],
    }]
};

const onResetClick = () => {
    formValue.value['identifier'] = "";
    formValue.value['password'] = "";
};

const onSubmitClick = async () => {
    try {
        await formRef.value?.validate();
        emits('submit', formValue.value);
    } catch (err) { }
};
</script>