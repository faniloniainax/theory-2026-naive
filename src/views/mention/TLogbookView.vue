<template>
    <NSpace justify="center" style="width: 100%;">
        <NCard>
            <NSpace justify="space-between">
                <NSpace>
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

    <TLogbookTable :progresses="progresses" @click:edit="onEditClick" @click:delete="onDeleteClick" />
    <TLogbookForm v-model:show="showFormModal" :is-edit-mode="isEditMode" :progress="progress"
        :branch-id="filters.branchId!" :stage-id="filters.stageId!" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Options } from '@/lib/options';
import { fetchBranches } from '@/services/branches';
import { fetchClasses } from '@/services/classes';
import { fetchFields } from '@/services/fields';
import { addProgress, deleteProgress, editProgress, fetchProgressBlocks, fetchProgresses } from '@/services/progresses';
import { fetchStages } from '@/services/stages';
import { type Branch } from '@/types/branch';
import { type Class } from '@/types/class';
import { type Field } from '@/types/field';
import { type ProgressBlock } from '@/types/progress';
import { type Stage } from '@/types/stage';
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
const progresses = ref<ProgressBlock[]>([]);

const saveCourseDisabled = ref(true);
const showFormModal = ref(false);
const isEditMode = ref(false);
const progress = ref<ProgressBlock | null>(null);

const onAddClick = () => {
    isEditMode.value = false;
    showFormModal.value = true;
    progress.value = {} as ProgressBlock;

    progress.value['date'] = new Date().toISOString();
    progress.value['class_id'] = filters.value.classId!;
};

const onEditClick = (p: ProgressBlock) => {
    isEditMode.value = true;
    showFormModal.value = true;

    progress.value = p;
};

const onDeleteClick = async (p: ProgressBlock) => {
    await deleteProgress(p['id'], loadingBar, message);
};

const onSubmit = async (p: ProgressBlock) => {
    // If it's a timestamp, we'll transform it to UTC Midnight
    if (typeof p['date'] === 'number')
        p['date'] = Dates.toUTCMidnight(p['date']);

    if (!isEditMode.value)
        await addProgress(p, loadingBar, message);
    else
        await editProgress(p['id'], p, loadingBar, message);

    progresses.value = await fetchProgresses(loadingBar, message, { classId: filters.value.classId! }) as unknown as ProgressBlock[];
};

// When the class changes, the save course button isn't disabled.
watch(() => filters.value.classId, (newClass, oldClass) => {
    if (!newClass || newClass.length == 0)
        saveCourseDisabled.value = true;
    else
        saveCourseDisabled.value = false;
});

// When the save course button isn't disabled, we fetch progress data
// for the specific class.
watch(() => saveCourseDisabled.value, async (newS, _) => {
    if (newS === true) {
        progresses.value = [];
        return;
    }

    // FIXME: This should fetch the block data
    // instead of the raw data, but w/e.
    progresses.value = await fetchProgresses(loadingBar, message, { classId: filters.value.classId! }) as unknown as ProgressBlock[];
});

// When the field filter changes, branches are fetched.
watch(() => filters.value.fieldId, async (newFieldId, _) => {
    if (newFieldId === null) {
        branches.value = [];
        filters.value.branchId = null;
        return;
    }

    branches.value = await fetchBranches(loadingBar, message, { fieldId: newFieldId });
});

// When a branch and a stage are selected, we fetch the
// relevant classes.
watch(() => [filters.value.branchId, filters.value.stageId], async ([newBranchId, newStageId], [_, __]) => {
    if (newBranchId === null || newStageId === null) {
        classes.value = [];
        filters.value.classId = null;
        return;
    }

    classes.value = await fetchClasses(loadingBar, message, { branchId: newBranchId, stageId: newStageId });
});

onMounted(async () => {
    fields.value = await fetchFields(loadingBar, message);
    stages.value = await fetchStages(loadingBar, message);
});
</script>