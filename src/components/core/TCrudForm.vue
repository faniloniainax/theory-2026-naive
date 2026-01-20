<template>
    <NForm ref="formRef" :model="formValue" :rules="formRules">
        <NGrid :cols="columns">
            <NFormItemGi v-for="input in inputs" :path="input['path']" :label="input['name'] + ':'">
                <template v-if="input['kind'] === 'date'">
                    <NDatePicker />
                </template>
                <template v-else-if="input['kind'] === 'number'">
                    <NInputNumber clearable :placeholder="input['placeholder']" :max="input['max']" :min="input['min']"
                        v-model:value="formValue[input['path']]" />
                </template>
                <template v-else-if="input['kind'] === 'string'">
                    <NInput clearable :type="input['textArea'] ? 'textarea' : 'text'" :maxlength="input['max']"
                        v-model:value="formValue[input['path']]" />
                </template>
                <template v-else-if="input['kind'] === 'foreign'">
                    <NSelect clearable filterable :options="foreignSources.get(input['name'])"
                        :placeholder="input['placeholder']" />
                </template>
            </NFormItemGi>
        </NGrid>
    </NForm>
</template>

<script setup lang="ts">
import { Http } from '@/lib/http';
import type { CrudInput } from '@/types/crud';
import { useMessage, type FormInst, type FormItemRule, type FormRules } from 'naive-ui';

type Props = {
    columns: number;
    inputs: CrudInput[];
    data: any;
};

const props = defineProps<Props>();
const message = useMessage();

const formRef = ref<FormInst | null>(null);
const formValue = ref<any>({});
const foreignSources = ref(new Map<string, any>());

const formRules = ref<FormRules>({});

onMounted(async () => {
    props.inputs.forEach(async i => {
        // We'll load default data as well
        if (props.data[i['path']]) {
            formValue.value[i['path']] = props.data[i['path']]
        }
        else {
            if (i['kind'] === 'date')
                formValue.value[i['path']] = new Date().toISOString()
            else if (i['kind'] === 'string')
                formValue.value[i['path']] = "";
            else if (i['kind'] === 'number')
                formValue.value[i['path']] = 0;
            else if (i['kind'] === 'foreign')
                formValue.value[i['path']] = null;
        }

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
                const res = await Http.get(i['url'], { params: i['params'] });

                if (res.status !== 200) {
                    let plural = i['plural'] ?? 'entités';
                    message.error(`Erreur durant le chargement des ${plural} pour le formulaire.`);
                    return;
                }

                foreignSources.value.set(i['name'], res.data.map(i['mapFn']));
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