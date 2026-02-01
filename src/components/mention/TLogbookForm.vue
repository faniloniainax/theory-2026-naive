<template>
    <NModal preset="dialog" :title="title" v-model:show="showModal" @update:show="onShowUpdate" closable close-on-esc>
        <NSpace vertical>
            <NTabs type="line" animated>
                <NTabPane name="coreForm" tab="Informations basiques">
                    <NForm ref="coreFormRef" :model="formValue">
                        <NFormItem path="date" label="Date de la séance:">
                            <NDatePicker type="date" format="dd MMMM yyyy" v-model:value="formValue['date']"
                                :placeholder="Dates.format(new Date(), 'dd MMMM yyyy')" />
                        </NFormItem>
                        <NFormItem path="class_id" label="Classe concernée:">
                            <NSelect placeholder="Aucune classe..." :options="Options.formatClasses(classes)"
                                v-model:value="formValue['class_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                        <NFormItem path="hour_part_id" label="Horaire de la séance:">
                            <NSelect placeholder="Aucun horaire..." :options="Options.formatHourParts(hourParts)"
                                v-model:value="formValue['hour_part_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                        <NFormItem path="const_element_id" label="Elément constitutif concerné:">
                            <NSelect placeholder="Aucun élément constitutif..."
                                :options="Options.formatConstElements(constElements)"
                                v-model:value="formValue['const_element_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                        <NFormItem path="teacher_id" label="Enseignant responsable:">
                            <NSelect placeholder="Aucun enseignant..." :options="Options.formatTeachers(teachers)"
                                v-model:value="formValue['teacher_id']">
                                <NEmpty description="Aucune donnée." />
                            </NSelect>
                        </NFormItem>
                    </NForm>
                </NTabPane>
                <NTabPane name="contextForm" tab="Contexte de la séance">
                    <NForm ref="contextFormRef" :model="formValue">
                        <NInput type="textarea" maxlength="255" show-count
                            placeholder="Racontez ce qui a été éffectué durant cette séance..."
                            v-model:value="formValue['fallback_context']" />
                    </NForm>
                </NTabPane>
            </NTabs>

            <NSpace justify="end">
                <NButton @click="onCancelClick">
                    Annuler
                </NButton>
                <NButton @click="onSubmitClick">
                    Valider
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
import { type Class } from '@/types/class';
import { type ConstElement } from '@/types/const_element';
import { type HourPart } from '@/types/hour_part';
import type { ProgressBlock } from '@/types/progress';
import { type Teacher } from '@/types/teacher';
import { type FormInst, useLoadingBar, useMessage } from 'naive-ui';

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

const onShowUpdate = (newShow: boolean) => emits('update:show', newShow);

const onSubmitClick = () => {
    emits('submit', formValue.value);
};

const onCancelClick = () => {
    emits('update:show', false);
};

const synchronizePropsToLocalData = (isEditMode: boolean, progress: ProgressBlock | null) => {
    formValue.value = {};

    if (!progress)
        return;

    if (!isEditMode) {
        formValue.value['date'] = Dates.getTimeStamp(progress['date']);
        formValue.value['class_id'] = progress['class_id'];
        return;
    }

    formValue.value['id'] = progress['id'];
    formValue.value['date'] = Dates.getTimeStamp(progress['date']);
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