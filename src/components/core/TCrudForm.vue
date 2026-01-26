<template>
    <NForm ref="formRef" :model="formValue" :rules="formRules">
        <NGrid :cols="columns">
            <NFormItemGi v-for="input in inputs" :path="input['path']" :label="input['name'] + ':'"
                :span="input['span']">
                <template v-if="input['kind'] === 'date'">
                    <NDatePicker type="date" format="dd MMMM yyyy" v-model:value="formValue[input['path']]"
                        :placeholder="input['placeholder']" />
                </template>
                <template v-else-if="input['kind'] === 'number'">
                    <NInputNumber clearable :placeholder="input['placeholder']" :max="input['max']" :min="input['min']"
                        v-model:value="formValue[input['path']]" />
                </template>
                <template v-else-if="input['kind'] === 'string'">
                    <NInput clearable :type="input['textArea'] ? 'textarea' : 'text'" :maxlength="input['max']"
                        :placeholder="input['placeholder']" v-model:value="formValue[input['path']]" />
                </template>
                <template v-else-if="input['kind'] === 'foreign'">
                    <NSelect placement="top" clearable filterable :options="foreignSources.get(input['name'])"
                        :placeholder="input['placeholder']" v-model:value="formValue[input['path']]">
                        <!-- TODO: Write a better error message here -->
                        <template #empty>
                            <NEmpty :description="`Aucune donnée.`" />
                        </template>
                    </NSelect>
                </template>
                <template v-else-if="input['kind'] === 'boolean'">
                    <NSwitch v-model:value="formValue[input['path']]" />
                </template>
            </NFormItemGi>
        </NGrid>

        <NSpace justify="end" align="end">
            <NButton type="error" ghost @click="onCancelClick">Annuler</NButton>
            <NButton type="success" ghost @click="onSubmitClick">Envoyer</NButton>
        </NSpace>
    </NForm>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Http } from '@/lib/http';
import type { CrudInput } from '@/types/crud';
import { useMessage, type FormInst, type FormItemRule, type FormRules } from 'naive-ui';

type Props = {
    columns: number;
    inputs: CrudInput[];
    data: any;
};

type Emits = {
    (event: 'cancel'): void;
    (event: 'submit', data: any): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const message = useMessage();

const formRef = ref<FormInst | null>(null);
const formValue = ref<any>({});
const foreignSources = ref(new Map<string, any>());

const formRules = ref<FormRules>({});

const loadDefaultDataForInput = (input: CrudInput) => {
    if (props.data[input['path']]) {
        if (input['kind'] === 'date') {
            formValue.value[input['path']] = Dates.getTimeStamp(props.data[input['path']]);
        } else {
            formValue.value[input['path']] = props.data[input['path']];
        }
    } else {
        if (input['kind'] === 'date')
            formValue.value[input['path']] = Dates.getTimeStamp(new Date().toISOString());
        else if (input['kind'] === 'string')
            formValue.value[input['path']] = "";
        else if (input['kind'] === 'number')
            formValue.value[input['path']] = 0;
        else if (input['kind'] === 'foreign')
            formValue.value[input['path']] = null;
        else if (input['kind'] === 'boolean')
            formValue.value[input['path']] = false;
    }
};

const onCancelClick = () => {
    emits('cancel');
};

const onSubmitClick = async () => {
    try {
        await formRef.value?.validate();
        const payload = { ...formValue.value };

        props.inputs.forEach(i => {
            if (i['kind'] === 'date' && payload[i['path']]) {
                payload[i['path']] = Dates.toUTCMidnight(payload[i['path']]);
            }
        })

        emits('submit', payload);
    } catch (e) {
        message.error("Le formulaire n'est pas valide.");
    }
};

watch(() => props.data, (newData) => {
    props.inputs.forEach(loadDefaultDataForInput);
});

onMounted(async () => {
    for (const p in props.data) {
        formValue.value[p] = props.data[p];
    }

    const foreignLoadPromises = props.inputs
        .filter(i => i['kind'] === 'foreign')
        .map(async (i) => {
            const res = await Http.get(i['url'], { params: i['params'] });

            if (res.status !== 200) {
                let plural = i['plural'] ?? 'entités';
                message.error(`Erreur durant le chargement des ${plural} pour le formulaire.`);
                return;
            }

            foreignSources.value.set(i['name'], res.data.map(i['mapFn']));
        });

    await Promise.all(foreignLoadPromises);
    props.inputs.forEach(async i => {
        loadDefaultDataForInput(i);

        // Dates don't have to be validated
        // using the formRules API of NaiveUI
        if (i['kind'] === 'date')
            return;

        switch (i['kind']) {
            case 'number':
                {
                    let r = [] as FormItemRule[];

                    if (i['max']) {
                        r.push({
                            max: i['max'],
                            type: 'integer',
                            trigger: ['blur', 'input'],
                            message: `La valeur maximale du champs "${i['name']}" est ${i['max']}.`
                        } as FormItemRule);
                    }
                    if (i['min']) {
                        r.push({
                            min: i['min'],
                            type: 'integer',
                            trigger: ['blur', 'input'],
                            message: `La valeur minimale du champs "${i['name']}" est ${i['min']}.`
                        } as FormItemRule);
                    }
                    if (i['required']) {
                        r.push({
                            type: 'integer',
                            trigger: ['blur', 'input'],
                            required: true,
                            message: `Le champs "${i['name']}" est requis.`
                        } as FormItemRule);
                    }

                    formRules.value[i['path']] = r;
                    break;
                }
            case 'string':
                {
                    let r = [] as FormItemRule[];

                    if (i['max']) {
                        r.push({
                            max: i['max'],
                            type: 'string',
                            trigger: ['blur', 'input'],
                            message: `La taille maximale du champs "${i['name']}" est de ${i['max']} caractères.`,
                        } as FormItemRule);
                    }
                    if (i['min']) {
                        r.push({
                            min: i['min'],
                            type: 'string',
                            trigger: ['blur', 'input'],
                            message: `La taille minimale du champs "${i['min']}" est de ${i['min']} caractères.`
                        } as FormItemRule)
                    }
                    if (i['required']) {
                        r.push({
                            type: 'string',
                            required: true,
                            trigger: ['blur', 'input'],
                            message: `Le champs "${i['name']}" est requis.`,
                        } as FormItemRule);
                    }

                    formRules.value[i['path']] = r;
                    break;
                }
            case 'foreign': {
                formRules.value[i['path']] = {
                    type: 'string',
                    required: true,
                    trigger: ['blur', 'trigger'],
                    message: `Le champs "${i['name']}" est requis.`
                };
                break;
            }
        }
    })
});
</script>