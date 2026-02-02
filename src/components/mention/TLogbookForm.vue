<template>
    <NModal preset="dialog" :title="title" v-model:show="showModal" @update:show="onShowUpdate" closable close-on-esc>
        <NSpace vertical>
            <NTabs animated v-model:value="formsTab" @before-leave="() => false">
                <NTabPane name="coreForm" tab="Informations basiques">
                    <NForm ref="coreFormRef" :model="formValue" :rules="coreFormRules">
                        <NFormItem path="date" label="Date de la séance:">
                            <NDatePicker type="date" format="dd MMMM yyyy" v-model:value="formValue['date']"
                                :placeholder="Dates.format(new Date(), 'dd MMMM yyyy')" />
                        </NFormItem>
                        <NFormItem path="class_id" label="Classe concernée:">
                            <NSelect filterable clearable placeholder="Aucune classe..."
                                :options="Options.formatClasses(classes)" v-model:value="formValue['class_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                        <NFormItem path="hour_part_id" label="Horaire de la séance:">
                            <NSelect filterable clearable placeholder="Aucun horaire..."
                                :options="Options.formatHourParts(hourParts)" v-model:value="formValue['hour_part_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                        <NFormItem path="const_element_id" label="Elément constitutif concerné:">
                            <NSelect filterable clearable placeholder="Aucun élément constitutif..."
                                :options="Options.formatConstElements(constElements)"
                                v-model:value="formValue['const_element_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                        <NFormItem path="teacher_id" label="Enseignant responsable:">
                            <NSelect filterable clearable placeholder="Aucun enseignant..."
                                :options="Options.formatTeachers(teachers)" v-model:value="formValue['teacher_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                    </NForm>
                </NTabPane>
                <NTabPane name="contextForm" tab="Contexte de la séance">
                    <NForm ref="contextFormRef" :model="formValue" :rules="contextFormRules">
                        <NFormItem path="fallback_context" label="Description du contenu du cours:">
                            <NInput clearable type="textarea" maxlength="255" show-count
                                placeholder="Racontez ce qui a été éffectué durant cette séance..."
                                v-model:value="formValue['fallback_context']" />
                        </NFormItem>
                    </NForm>
                </NTabPane>
            </NTabs>

            <NSpace justify="end">
                <NButton ghost :type="formsTab === 'contextForm' ? 'info' : 'error'" @click="onCancelClick">
                    {{ formsTab === 'contextForm' ? 'Précédent' : 'Annuler' }}
                </NButton>
                <NButton ghost type="success" @click="onValidateClick">
                    {{ formsTab === "coreForm" ? "Suivant" : "Valider" }}
                </NButton>
            </NSpace>
        </NSpace>
    </NModal>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Http } from '@/lib/http';
import { Options } from '@/lib/options';
import { fetchClasses } from '@/services/classes';
import { fetchConstElements } from '@/services/const_elements';
import { fetchHourParts } from '@/services/hour_parts';
import { fetchTeachers } from '@/services/teachers';
import type { Class } from '@/types/class';
import type { ConstElement } from '@/types/const_element';
import type { HourPart } from '@/types/hour_part';
import type { ProgressBlock } from '@/types/progress';
import type { Teacher } from '@/types/teacher';
import { type FormInst, type FormRules, useLoadingBar, useMessage } from 'naive-ui';
import { render } from 'vue';

type Props = {
    show: boolean;
    isEditMode: boolean;
    progress: ProgressBlock | null;
    stageId: string | null;
    branchId: string | null;
};

type Emits = {
    (event: 'update:show', show: boolean): void;
    (event: 'submit', data: ProgressBlock): void;
};

const emits = defineEmits<Emits>();
const props = defineProps<Props>();

const message = useMessage();
const loadingBar = useLoadingBar();

const coreFormRef = useTemplateRef('coreFormRef');
const contextFormRef = useTemplateRef('contextFormRef');

const formsTab = ref("coreForm");
const formValue = ref<any>({});
const classes = ref<Class[]>([]);
const teachers = ref<Teacher[]>([]);
const hourParts = ref<HourPart[]>([]);
const constElements = ref<ConstElement[]>([]);

const title = computed(() => !props.isEditMode ? "Enregistrer une séance" : "Modifier un enregistrement de séance");
const showModal = computed({
    get: () => props.show,
    set: (newShow: boolean) => emits('update:show', newShow)
});

const coreFormRules: FormRules = {
    class_id: {
        type: 'string',
        required: true,
        message: "La classe est requise.",
    },
    hour_part_id: {
        type: 'string',
        required: true,
        message: "La tranche horaire est requise.",
    },
    const_element_id: {
        type: 'string',
        required: true,
        message: "L'élément constitutif est requis.",
    },
    teacher_id: {
        type: 'string',
        required: true,
        message: "L'enseignant est requis.",
    }
};

const contextFormRules: FormRules = {
    fallback_context: {
        type: 'string',
        min: 5,
        required: true,
        message: 'Le contexte doit contenir au moins 5 caractères.'
    },
};

const onShowUpdate = (newShow: boolean) => emits('update:show', newShow);

const validateCoreForm = async () => {
    try {
        await coreFormRef.value?.validate();
        return true;
    } catch (e: any) {
        console.error(e);
    }

    return false;
};

const validateContextForm = async () => {
    try {
        await contextFormRef.value?.validate();
        return true;
    } catch (e: any) {
        console.error(e);
    }

    return false;
};

const onValidateClick = async () => {
    if (formsTab.value === "coreForm") {
        const ok = await validateCoreForm();

        if (!ok)
            return;

        formsTab.value = "contextForm";
    } else if (formsTab.value === "contextForm") {
        const ok = await validateContextForm();

        if (!ok)
            return;

        // Ensure date is always a number
        const submittedValue = { ...formValue.value };
        if (typeof submittedValue['date'] === 'string') {
            submittedValue['date'] = new Date(submittedValue['date']).getTime();
        }

        emits('submit', submittedValue);
        formsTab.value = "coreForm";
    }
};

const onCancelClick = () => {
    if (formsTab.value === 'contextForm') {
        formsTab.value = 'coreForm';
        return;
    }

    emits('update:show', false);
};

const synchronizePropsToLocalData = (isEditMode: boolean, progress: ProgressBlock | null) => {
    formValue.value = {};

    if (!progress)
        return;

    // Convert date to numeric timestamp (milliseconds)
    const getDateTimestamp = (date: any): number => {
        if (typeof date === 'number') return date;
        if (typeof date === 'string') return new Date(date).getTime();
        return Dates.getTimeStamp(date);
    };

    const dateTimestamp = getDateTimestamp(progress['date']);

    if (!isEditMode) {
        formValue.value['date'] = dateTimestamp;
        formValue.value['class_id'] = progress['class_id'];
        return;
    }

    formValue.value['id'] = progress['id'];
    formValue.value['date'] = dateTimestamp;
    formValue.value['class_id'] = progress['class_id'];
    formValue.value['teacher_id'] = progress['teacher_id'];
    formValue.value['hour_part_id'] = progress['hour_part_id'];
    formValue.value['const_element_id'] = progress['const_element_id'];
    formValue.value['fallback_context'] = progress['fallback_context'];
};


watch(() => props.progress, (newProgress, _) => {
    synchronizePropsToLocalData(props.isEditMode, newProgress);
});

watch(() => [props.branchId, props.stageId], async ([newBranchId, newStageId], [_, __]) => {
    if (newBranchId === null || newStageId === null) {
        constElements.value = [];
        return;
    }

    constElements.value = await fetchConstElements(loadingBar, message, { branchId: newBranchId, stageId: newStageId });
});

watch(() => formValue.value['const_element_id'], (newCEId, _) => {
    if (newCEId === null)
        return;

    const first = constElements.value.find(c => c['id'] == newCEId);

    if (!first) {
        formValue.value['teacher_id'] = null;
        return;
    }

    formValue.value['teacher_id'] = first['teacher_id'];
});

onMounted(async () => {
    synchronizePropsToLocalData(props.isEditMode, props.progress);

    classes.value = await fetchClasses(loadingBar, message);
    teachers.value = await fetchTeachers(loadingBar, message);
    hourParts.value = await fetchHourParts(loadingBar, message);
})
</script>