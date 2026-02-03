<template>
    <NSpace justify="center" style="width: 100%;">
        <NCard>
            <NSpace justify="space-between">
                <NSpace justify="center">
                    <NSelect filterable clearable placeholder="Aucune mention..." v-model:value="filters.fieldId"
                        :options="Options.formatFields(fields)">
                        <template #empty>
                            <NEmpty description="Aucune donnée." />
                        </template>
                    </NSelect>
                    <NSelect filterable clearable placeholder="Aucun parcours..." v-model:value="filters.branchId"
                        :options="Options.formatBranches(branches)">
                        <template #empty>
                            <NEmpty description="Aucune donnée." />
                        </template>
                    </NSelect>
                    <NSelect filterable clearable placeholder="Aucun niveau..." v-model:value="filters.stageId"
                        :options="Options.formatStages(stages)">
                        <template #empty>
                            <NEmpty description="Aucune donnée." />
                        </template>
                    </NSelect>
                    <NSelect filterable clearable placeholder="Aucune classe..." v-model:value="filters.classId"
                        :options="Options.formatClasses(classes)">
                        <template #empty>
                            <NEmpty description="Aucune donnée." />
                        </template>
                    </NSelect>
                </NSpace>

                <NButton ghost type="success" :disabled="saveCourseDisabled" @click="onAddClick">
                    <template #icon>
                        <NIcon>
                            <AddIcon />
                        </NIcon>
                    </template>

                    Enregister une séance
                </NButton>
            </NSpace>
        </NCard>
    </NSpace>

    <TLogbookTable :progresses="progresses" @click:edit="onEditClick" @click:delete="onDeleteClick"
        @click:context="onContextClicked" v-model:page="page" v-model:page-size="pageSize"
        v-model:total-pages="totalPages" />
    <TLogbookForm v-model:show="showFormModal" :is-edit-mode="isEditMode" :progress="progress"
        :branch-id="filters.branchId!" :stage-id="filters.stageId!" @submit="onSubmit" />

    <NModal preset="dialog" title="Informations sur le contexte" v-model:show="contextDisplayRequested" closable
        close-on-esc>
        <NSpace vertical>
            <NP>
                <b>Enseignant: </b>
                {{ currentCtxSubject ?
                    Texts.formatTeacher(currentCtxSubject['teacher']) :
                    "<aucun>" }}
            </NP>
            <NP><b>Contexte du cours: </b></NP>
            <NCard embedded>
                {{ currentCtxSubject ? currentCtxSubject['fallback_context'] : "<aucun>" }}
            </NCard>
        </NSpace>
    </NModal>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Options } from '@/lib/options';
import { Store } from '@/lib/store';
import { Texts } from '@/lib/texts';
import { fetchBranches } from '@/services/branches';
import { fetchClasses } from '@/services/classes';
import { fetchFields } from '@/services/fields';
import { addProgress, deleteProgress, editProgress, fetchProgressBlocks, fetchProgresses } from '@/services/courses';
import { fetchStages } from '@/services/stages';
import type { Branch } from '@/types/branch';
import type { Class } from '@/types/class';
import type { CrudData, CrudPaginatedData } from '@/types/crud';
import type { Field } from '@/types/field';
import type { Course, CourseBlock } from '@/types/course';
import type { Stage } from '@/types/stage';
import { useLoadingBar, useMessage } from 'naive-ui';
import AddIcon from 'vicons/ionicons-v5/AddOutline.vue';

const message = useMessage();
const loadingBar = useLoadingBar();

const filters = ref<{
    fieldId: null | string,
    branchId: null | string,
    stageId: null | string,
    classId: null | string,
}>({
    fieldId: null,
    branchId: null,
    stageId: null,
    classId: null,
});

const fields = ref<Field[]>([]);
const branches = ref<Branch[]>([]);
const stages = ref<Stage[]>([]);
const classes = ref<Class[]>([]);
const progresses = ref<CourseBlock[]>([]);

const saveCourseDisabled = ref(true);
const showFormModal = ref(false);
const isEditMode = ref(false);
const progress = ref<CourseBlock | null>(null);

const currentCtxSubject = ref<CourseBlock | null>(null);
const contextDisplayRequested = ref(false);

const page = ref<number>(1);
const pageSize = ref<number>(10);
const totalPages = ref<number>(1);

const fetchData = async () => {
    const res = await fetchProgresses(loadingBar, message, { classId: filters.value.classId! }, page.value, pageSize.value) as CrudPaginatedData<Course>;

    if (res.data === undefined || res.pagination === undefined) {
        progresses.value = res as CrudData<Course> as unknown as CourseBlock[];

        totalPages.value = 1;
        return;
    }

    const pg = res.pagination;
    progresses.value = res.data as unknown as CourseBlock[];

    page.value = pg['page'] || page.value;
    totalPages.value = pg['total_pages'] || 1;
    pageSize.value = pg['per_page'] || pageSize.value;
};

const onAddClick = () => {
    isEditMode.value = false;
    showFormModal.value = true;
    progress.value = {} as CourseBlock;

    progress.value['date'] = new Date().toISOString();
    progress.value['class_id'] = filters.value.classId!;
};

const onEditClick = (p: CourseBlock) => {
    isEditMode.value = true;
    showFormModal.value = true;

    progress.value = p;
};

const onDeleteClick = async (p: CourseBlock) => {
    await deleteProgress(p['id'], loadingBar, message);
    await fetchData();
};

const onContextClicked = (p: CourseBlock) => {
    currentCtxSubject.value = p;
    contextDisplayRequested.value = true;
};

const onSubmit = async (p: CourseBlock) => {
    // If it's a timestamp, we'll transform it to UTC Midnight
    if (typeof p['date'] === 'number')
        p['date'] = Dates.toUTCMidnight(p['date']);

    let ok = true;
    if (!isEditMode.value)
        ok = await addProgress(p, loadingBar, message);
    else
        ok = await editProgress(p['id'], p, loadingBar, message);

    if (ok)
        showFormModal.value = false;

    await fetchData();
};

// When the class changes, the save course button isn't disabled.
watch(() => filters.value.classId, async (newClass, oldClass) => {
    if (!newClass || newClass.length == 0) {
        progresses.value = [];
        saveCourseDisabled.value = true;
        return;
    }

    saveCourseDisabled.value = false;
    await fetchData();
});

watch(filters, (newFilters) => {
    Store.store('logbook-filters', newFilters);
}, { deep: true });

// When the field filter changes, branches are fetched.
watch(() => filters.value.fieldId, async (newFieldId, _) => {
    filters.value.branchId = null;

    if (newFieldId === null) {
        branches.value = [];
        return;
    }

    branches.value = await fetchBranches(loadingBar, message, { fieldId: newFieldId });
});

// When a branch and a stage are selected, we fetch the
// relevant classes.
watch(() => [filters.value.branchId, filters.value.stageId], async ([newBranchId, newStageId], [_, __]) => {
    filters.value.classId = null;

    if (newBranchId === null || newStageId === null) {
        classes.value = [];
        return;
    }

    classes.value = await fetchClasses(loadingBar, message, { branchId: newBranchId, stageId: newStageId });
});

onMounted(async () => {
    const parsed = Store.load<typeof filters.value>('logbook-filters');

    fields.value = await fetchFields(loadingBar, message);
    stages.value = await fetchStages(loadingBar, message);

    if (parsed?.fieldId) {
        filters.value.fieldId = parsed.fieldId
        branches.value = await fetchBranches(loadingBar, message, { fieldId: parsed.fieldId })
    }

    if (parsed?.branchId && parsed?.stageId) {
        filters.value.stageId = parsed.stageId
        filters.value.branchId = parsed.branchId
        classes.value = await fetchClasses(loadingBar, message, {
            branchId: parsed.branchId,
            stageId: parsed.stageId
        })
    }

    if (parsed?.classId)
        filters.value.classId = parsed.classId;
});
</script>