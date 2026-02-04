<template>
    <NModal preset="dialog" closable close-on-esc :title="title" :show="props.show" @update:show="onUpdateShow">
        <NForm ref="formRef" :model="formValue" :rules="formRules">
            <NFormItem path="label" label="Libéllé:">
                <NInput placeholder="Chap 1. Xxx..." clearable maxlength="100" show-count
                    v-model:value="formValue['label']" />
            </NFormItem>
            <NFormItem path="const_element_id" label="Elément constitutif concerné:">
                <NSelect filterable clearable placeholder="Aucun élément constitutif..."
                    v-model:value="formValue['const_element_id']" :options="Options.formatConstElements(constElements)">
                    <template #empty>
                        <NEmpty description="Aucune donnée." />
                    </template>
                </NSelect>
            </NFormItem>

            <NSpace justify="end" align="center">
                <NButton ghost type="error" @click="onUpdateShow(false)">Annuler</NButton>
                <NButton ghost type="success" @click="onSubmitClick">Valider</NButton>
            </NSpace>
        </NForm>
    </NModal>
</template>

<script setup lang="ts">
import { Options } from '@/lib/options';
import type { ConstElement } from '@/types/const_element';
import type { ElementNode } from '@/types/element';
import type { FormRules } from 'naive-ui';

type Props = {
    show: boolean;
    isEditMode: boolean;
    constElements: ConstElement[];
    element: ElementNode | null;
};

type Emits = {
    (event: 'update:show', newShow: boolean): void;
    (event: 'submit', value: any): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const title = computed(() => !props.isEditMode ? "Ajouter un élément" : "Modifier un élément");

const formRef = useTemplateRef('formRef');
const formValue = ref({
    id: null as string | null,
    label: null as string | null,
    parent_id: null as string | null,
    const_element_id: null as string | null
});

const formRules: FormRules = {
    label: {
        type: 'string',
        required: true,
        min: 5,
        message: 'Le libéllé doit contenir au moins 5 caractères.'
    },
    const_element_id: {
        type: 'string',
        required: true,
        message: "L'élément constitutif est requis."
    },
};

const syncWithLocalData = () => {
    if (!props.element) {
        formValue.value['id'] = null;
        formValue.value['label'] = null;
        formValue.value['parent_id'] = null;
        formValue.value['const_element_id'] = null;
    } else {
        formValue.value['id'] = props.element['id'] ?? null;
        formValue.value['label'] = props.element['label'] ?? null;
        formValue.value['parent_id'] = props.element['parent_id'] ?? null;
        formValue.value['const_element_id'] = props.element['const_element_id'] ?? null;
    }
};

const onUpdateShow = (newShow: boolean) => {
    emits('update:show', newShow);
};

const onSubmitClick = async () => {
    try { await formRef.value?.validate(); } catch (e) { return; }
    emits('submit', formValue.value);
};

watch(() => [props.element], () => {
    syncWithLocalData();
});

onMounted(() => {
    syncWithLocalData();
});
</script>