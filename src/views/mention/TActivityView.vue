<template>
    <NSpace justify="center" style="width: 100%;">
        <NCard>
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
                <NSelect filterable clearable placeholder="Aucun enseignant..." v-model:value="filters.teacherId"
                    :options="Options.formatTeachers(teachers)">
                    <template #empty>
                        <NEmpty description="Aucune donnée." />
                    </template>
                </NSelect>
            </NSpace>
        </NCard>
    </NSpace>

    <TActivityHeatmap :branch-id="filters.branchId" :stage-id="filters.stageId" :teacher-id="filters.teacherId"
        :class-id="filters.classId" />
</template>

<script setup lang="ts">
import { Options } from '@/lib/options';
import { fetchBranches } from '@/services/branches';
import { fetchClasses } from '@/services/classes';
import { fetchFields } from '@/services/fields';
import { fetchStages } from '@/services/stages';
import { fetchTeachers } from '@/services/teachers';
import type { Branch } from '@/types/branch';
import type { Class } from '@/types/class';
import type { Field } from '@/types/field';
import type { Stage } from '@/types/stage';
import type { Teacher } from '@/types/teacher';
import { heatmapMockData, useLoadingBar, useMessage } from 'naive-ui';

const loadingBar = useLoadingBar();
const message = useMessage();

const filters = ref<{
    fieldId: string | null,
    branchId: string | null,
    stageId: string | null,
    teacherId: string | null,
    classId: string | null,
}>({
    fieldId: null,
    branchId: null,
    stageId: null,
    teacherId: null,
    classId: null,
});

const fields = ref<Field[]>([]);
const branches = ref<Branch[]>([]);
const stages = ref<Stage[]>([]);
const teachers = ref<Teacher[]>([]);
const classes = ref<Class[]>([]);

watch(filters, (newFilters) => {
    localStorage.setItem('activity-filters', JSON.stringify(newFilters))
}, { deep: true });

watch(() => filters.value.fieldId, async (newFieldId) => {
    filters.value.branchId = null;

    if (newFieldId === null) {
        branches.value = [];
        return;
    }

    branches.value = await fetchBranches(loadingBar, message, { fieldId: newFieldId });
});

watch(() => [filters.value.branchId, filters.value.stageId], async ([newBranchId, newStageId]) => {
    filters.value.classId = null;

    if (newBranchId === null || newStageId === null) {
        classes.value = [];
        return;
    }

    classes.value = await fetchClasses(loadingBar, message, { branchId: newBranchId, stageId: newStageId });
});

onMounted(async () => {
    const storedFilters = localStorage.getItem('activity-filters')
    const parsed: typeof filters.value | null = storedFilters ? JSON.parse(storedFilters) : null

    fields.value = await fetchFields(loadingBar, message)
    stages.value = await fetchStages(loadingBar, message)
    teachers.value = await fetchTeachers(loadingBar, message)

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
        filters.value.classId = parsed.classId
    if (parsed?.teacherId)
        filters.value.teacherId = parsed.teacherId;
})
</script>