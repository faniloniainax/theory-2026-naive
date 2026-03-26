<template>
    <NForm ref="formRef" :model="formModel" :rules="formRules">
        <NGrid :cols="1">
            <NFormItemGi label="Nom d'utilisateur ou adresse e-mail:" path="identifier">
                <NInput placeholder="L1PRO1, _@gmail.com, ..." v-model:value="formModel['identifier']" />
            </NFormItemGi>
            <NFormItemGi label="Mot de passe:" path="password">
                <NInput placeholder="m0td3p4553..." type="password" show-password-toggle
                    v-model:value="formModel['password']" maxlength="30" />
            </NFormItemGi>
        </NGrid>

        <NDivider />
        <NSpace justify="end">
            <NButton ghost type="error" @click="onResetClick">Réinitialiser</NButton>
            <NButton ghost type="success" @click="onSubmitClick">Se connecter</NButton>
        </NSpace>
    </NForm>
</template>

<script setup lang="ts">
import type { Login } from '@/types/auth';
import { useDialog, useMessage, type FormRules } from 'naive-ui';

type Emits = {
    (event: 'submit', data: Login): void;
};

const emits = defineEmits<Emits>();
const dialog = useDialog();
const message = useMessage();

const formRef = useTemplateRef('formRef');
const formRules: FormRules = {
    identifier: {
        type: 'string',
        required: true,
        trigger: ['blur', 'change'],
        message: "L'identifiant est requis.",
    },
    password: {
        type: 'string',
        required: true,
        trigger: ['blur', 'change'],
        message: "Le mot de passe est requis.",
    }
};
const formModel = ref<Login>({
    identifier: '',
    password: '',
});

function onResetClick() {
    dialog.error({
        content: "Voulez-vous vraiment réinitialiser le formulaire ?",
        negativeText: "Annuler",
        positiveText: "Confirmer",
        onPositiveClick: () => {
            formModel.value['identifier'] = ''
            formModel.value['password'] = ''
        },
    });
}

async function onSubmitClick() {
    if (!(await tryFormValidation()))
        return;

    emits('submit', formModel.value);
}

async function tryFormValidation() {
    try {
        await formRef.value?.validate();
        return true;
    } catch (errs) {
        if (!Array.isArray(errs))
            console.error(errs);
        // FIXME: Gracefully handle multiple errors
        else
            errs.forEach(e => message.error(e[0].message));
    }

    return false;
}
</script>