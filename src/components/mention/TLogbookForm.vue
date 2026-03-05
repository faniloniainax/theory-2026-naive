<template>
    <NModal style="width: 40%;" preset="dialog" :title="title" v-model:show="showModal" @update:show="onShowUpdate"
        closable close-on-esc>
        <NSpace vertical justify="center" align="center">
            <NSteps size="medium" :current="currentStep" content-placement="bottom">
                <NStep>
                    Informations principales
                </NStep>
                <template v-for="tt in teachingTypes">
                    <NStep>
                        Contexte {{ tt['name'].toLowerCase() }}
                    </NStep>
                </template>
            </NSteps>

            <NTabs justify-content="center" type="line" animated @before-leave="() => false" v-model:value="currentTab">
                <NTabPane :name="-1" tab="Infos">
                    <NForm ref="coreFormRef" :model="formValue" :rules="coreFormRules">
                        <NGrid :cols="2" :x-gap="20">
                            <NFormItemGi path="date" label="Date de la séance:">
                                <NDatePicker type="date" format="dd MMMM yyyy" v-model:value="formValue['date']"
                                    :placeholder="Dates.format(new Date(), 'dd MMMM yyyy')" />
                            </NFormItemGi>
                            <NFormItemGi path="hour_part_id" label="Horaire de la séance:">
                                <NSelect filterable clearable placeholder="Aucun horaire..."
                                    :options="Options.formatHourParts(hourParts)"
                                    v-model:value="formValue['hour_part_id']">
                                    <template #empty>
                                        <NEmpty description="Aucune donnée." />
                                    </template>
                                </NSelect>
                            </NFormItemGi>
                            <NFormItemGi path="class_id" label="Classe concernée:">
                                <NSelect filterable clearable placeholder="Aucune classe..."
                                    :options="Options.formatClasses(classes)" v-model:value="formValue['class_id']"
                                    @update:value="onUpdateClassValue">
                                    <template #empty>
                                        <NEmpty description="Aucune donnée." />
                                    </template>
                                </NSelect>
                            </NFormItemGi>
                            <NFormItemGi path="teacher_id" label="Enseignant responsable:">
                                <NSelect filterable clearable placeholder="Aucun enseignant..."
                                    :options="Options.formatTeachers(teachers)" v-model:value="formValue['teacher_id']">
                                    <template #empty>
                                        <NEmpty description="Aucune donnée." />
                                    </template>
                                </NSelect>
                            </NFormItemGi>
                            <NFormItemGi path="room_id" label="Salle de la séance:">
                                <NSelect filterable clearable placeholder="Aucune salle..."
                                    :options="Options.formatRooms(rooms)" v-model:value="formValue['room_id']">
                                    <template #empty>
                                        <NEmpty description="Aucune donnée." />
                                    </template>
                                </NSelect>
                            </NFormItemGi>
                            <NFormItemGi path="const_element_id" label="Elément constitutif concerné:">
                                <NSelect filterable clearable placeholder="Aucun élément constitutif..."
                                    :options="Options.formatConstElements(constElements)"
                                    v-model:value="formValue['const_element_id']">
                                    <template #empty>
                                        <NEmpty description="Aucune donnée." />
                                    </template>
                                </NSelect>
                            </NFormItemGi>
                        </NGrid>
                    </NForm>
                </NTabPane>
                <template v-for="tt, i in teachingTypes">
                    <NTabPane :name="i" :tab="tt['name']">
                        <NForm :model="formValue['contexts'][tt.id]"
                            :ref="el => contextFormRefs[i] = el as unknown as FormInst">
                            <template v-if="tt['is_theoric']">
                                <template v-if="elementsTree.length > 0">
                                    <!-- FIXME: Ts isn't working yet... -->
                                    <NTree block-line cascade checkable :data="realTreeData" />
                                </template>
                                <template v-else>
                                    <NP :depth="3">Tout le syllabus a été effectué...</NP>
                                    <NFormItem path="description" label="Description du contexte:"
                                        :rule="requiredContextFormRule">
                                        <NInput rows="9" clearable type="textarea" maxlength="255" show-count
                                            placeholder="Racontez ce qui a été effectué durant cette séance..."
                                            v-model:value="formValue['contexts'][tt.id].description" />
                                    </NFormItem>
                                </template>
                            </template>
                            <template v-else>
                                <NFormItem path="description" label="Description du contexte:" :rule="contextFormRule">
                                    <NInput rows="9" clearable type="textarea" maxlength="255" show-count
                                        placeholder="Racontez ce qui a été effectué durant cette séance..."
                                        v-model:value="formValue['contexts'][tt.id].description" />
                                </NFormItem>
                            </template>
                        </NForm>
                    </NTabPane>
                </template>
            </NTabs>
        </NSpace>

        <NSpace justify="end">
            <NButton ghost :type="cancelType" @click="onCancelClick">{{ cancelText }}</NButton>
            <NButton ghost :type="submitType" @click="onSubmitClick">{{ submitText }}</NBUtton>
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
import type { Course } from '@/types/course';
import type { Teacher } from '@/types/teacher';
import { type FormInst, type FormItemRule, type FormRules, type TreeOption, useLoadingBar, useMessage } from 'naive-ui';
import type { Room } from '@/types/room';
import { fetchRooms } from '@/services/rooms';
import type { TeachingType } from '@/types/teaching_type';
import { fetchTeachingTypes } from '@/services/teaching_types';
import type { ElementNode } from '@/types/element';
import { fetchElementsNodeTree } from '@/services/elements';
import type { Context } from '@/types/context';

type Props = {
    show: boolean;
    isEditMode: boolean;
    course: Course | null;
    stageId: string | null;
    branchId: string | null;
    classId: string | null;
};

type Emits = {
    (event: 'update:show', show: boolean): void;
    (event: 'submit', data: Course): void;
};

const emits = defineEmits<Emits>();
const props = defineProps<Props>();

const message = useMessage();
const loadingBar = useLoadingBar();

const coreFormRef = useTemplateRef('coreFormRef');

const rooms = ref<Room[]>([]);
const classes = ref<Class[]>([]);
const teachers = ref<Teacher[]>([]);
const hourParts = ref<HourPart[]>([]);
const teachingTypes = ref<TeachingType[]>([]);
const constElements = ref<ConstElement[]>([]);
const elementsTree = ref<ElementNode[]>([]);
const realTreeData = ref<TreeOption[]>([]);

const formValue = ref<any>({});
const contextFormRefs = ref<(FormInst | null)[]>([]);

const currentStep = ref(1);
const currentTab = ref(-1);

const cancelType = computed(() => currentTab.value < 0 ? "error" : "info")
const cancelText = computed(() => currentTab.value < 0 ? "Annuler" : "Précédent");
const submitType = computed(() => currentTab.value < teachingTypes.value.length - 1 ? "info" : "success")
const submitText = computed(() => currentTab.value < teachingTypes.value.length - 1 ? "Suivant" : "Valider");

const title = computed(() => !props.isEditMode ? "Enregistrer une séance" : "Modifier un enregistrement de séance");
const showModal = computed({
    get: () => props.show,
    set: (newShow: boolean) => emits('update:show', newShow)
});

const coreFormRules: FormRules = {
    class_id: {
        type: 'string',
        required: true,
        trigger: ['blur', 'input'],
        message: "La classe est requise.",
    },
    teacher_id: {
        type: 'string',
        required: true,
        trigger: ['blur', 'input'],
        message: "L'enseignant est requis.",
    },
    room_id: {
        type: 'string',
        required: true,
        trigger: ['blur', 'input'],
        message: "La salle est requise.",
    },
    hour_part_id: {
        type: 'string',
        required: true,
        trigger: ['blur', 'input'],
        message: "La tranche horaire est requise.",
    },
    const_element_id: {
        type: 'string',
        required: true,
        trigger: ['blur', 'input'],
        message: "L'élément constitutif est requis.",
    },
};

const contextFormRule: FormItemRule = {
    min: 5,
    type: 'string',
    trigger: ['blur', 'input'],
    message: 'Le contexte doit contenir au moins 5 caractères.',
};

const requiredContextFormRule: FormItemRule = {
    required: true,
    min: 5,
    type: 'string',
    trigger: ['blur', 'input'],
    message: 'Le contexte est requis, et doit contenir au moins 5 caractères.',
};

const constructTreeData = () => {
    const mapCallback = (e: ElementNode): TreeOption => {
        return {
            id: e['id'],
            key: e['id'],
            label: e['label'],
            parent_id: e['parent_id'],
            const_element_id: e['const_element_id'],
            children: e['children'] ? e['children'].map(mapCallback) : undefined,
        };
    };

    realTreeData.value = elementsTree.value.map(mapCallback);
};

const onShowUpdate = (newShow: boolean) => emits('update:show', newShow);


const onCancelClick = () => {
    if (currentTab.value >= 0) {
        currentTab.value--;
        currentStep.value--;
        return;
    }

    emits('update:show', false);
};

const onSubmitClick = async () => {
    const advanceTab = () => { currentTab.value++; currentStep.value++ };

    if (currentTab.value === -1) {
        try {
            await coreFormRef.value?.validate();
            advanceTab();
        } catch (e) { }
    }
    else if (currentTab.value < teachingTypes.value.length - 1) {
        try {
            await contextFormRefs.value[currentTab.value]?.validate();
            advanceTab();
        } catch (e) { }
    } else {
        console.log(formValue.value);

    }
    // if (formsTab.value === "coreForm") {
    //     const ok = await validateCoreForm();

    //     if (!ok)
    //         return;

    //     formsTab.value = "contextForm";
    // } else if (formsTab.value === "contextForm") {
    //     const ok = await validateContextForm();

    //     if (!ok)
    //         return;

    //     // Ensure date is always a number
    //     const submittedValue = { ...formValue.value };
    //     if (typeof submittedValue['date'] === 'string') {
    //         submittedValue['date'] = new Date(submittedValue['date']).getTime();
    //     }

    //     emits('submit', submittedValue);
    //     formsTab.value = "coreForm";
    // }
};

const onUpdateClassValue = async (classId: string) => {
    const class_ = classes.value.find((c) => c['id'] == classId);

    if (!class_)
        return;

    formValue.value['const_element_id'] = null;
    constElements.value = await fetchConstElements(loadingBar, message, { branchId: class_['branch_id'], stageId: class_['stage_id'] })
};

const synchronizePropsToLocalData = (isEditMode: boolean, course: Course | null) => {
    formValue.value = {};

    if (!course)
        return;

    // Convert date to numeric timestamp (milliseconds)
    const getDateTimestamp = (date: any): number => {
        if (typeof date === 'number') return date;
        if (typeof date === 'string') return new Date(date).getTime();
        return Dates.getTimeStamp(date);
    };

    const dateTimestamp = getDateTimestamp(course['date']);
    const contextsMap = new Map<string, Context>();

    if (!isEditMode) {
        formValue.value['date'] = dateTimestamp;
        formValue.value['class_id'] = course['class_id'];
        formValue.value['contexts'] = contextsMap;
        console.log("CONTEXTS:", formValue.value['contexts']);
        return;
    }

    formValue.value['id'] = course['id'];
    formValue.value['date'] = dateTimestamp;
    formValue.value['class_id'] = course['class_id'];
    formValue.value['teacher_id'] = course['teacher_id'];
    formValue.value['hour_part_id'] = course['hour_part_id'];
    formValue.value['room_id'] = course['room_id'];
    formValue.value['const_element_id'] = course['const_element_id'];

    course['contexts']?.forEach(ctx => {
        contextsMap.set(ctx['teaching_type_id'], ctx);
    });
    formValue.value['contexts'] = contextsMap;
    console.log("EDITMODE:", formValue.value['contexts']);
};

const fetchElementsTree = async () => {
    if (!props.isEditMode) {
        if (!props.classId || !formValue.value['const_element_id']) {
            elementsTree.value = [];
            return;
        }

        elementsTree.value = await fetchElementsNodeTree(formValue.value['const_element_id'], "clean_node_tree", loadingBar, message, props.classId);
        constructTreeData();
    } else {
        // FIXME: Handle this
    }
};

watch(() => props.course, (newCourse, _) => {
    currentStep.value = 1;
    currentTab.value = -1;
    synchronizePropsToLocalData(props.isEditMode, newCourse);
});

watch(() => [props.branchId, props.stageId], async ([newBranchId, newStageId], [_, __]) => {
    if (newBranchId === null || newStageId === null) {
        constElements.value = [];
        return;
    }

    constElements.value = await fetchConstElements(loadingBar, message, { branchId: newBranchId, stageId: newStageId });
});

watch(() => formValue.value['const_element_id'], async (newCEId, _) => {
    if (newCEId === null)
        return;

    const first = constElements.value.find(c => c['id'] == newCEId);

    if (!first) {
        formValue.value['teacher_id'] = null;
        return;
    }

    formValue.value['teacher_id'] = first['teacher_id'];
    await fetchElementsTree();
});

onMounted(async () => {
    synchronizePropsToLocalData(props.isEditMode, props.course);

    rooms.value = await fetchRooms(loadingBar, message);
    classes.value = await fetchClasses(loadingBar, message);
    teachers.value = await fetchTeachers(loadingBar, message);
    hourParts.value = await fetchHourParts(loadingBar, message);
    teachingTypes.value = await fetchTeachingTypes(loadingBar, message);

    if (!props.isEditMode) {
        teachingTypes.value.forEach(tt => {
            formValue.value['contexts'][tt.id] = {
                description: '',
            };
        });
    }
})
</script>