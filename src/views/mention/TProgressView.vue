<template>
    <NSpace justify="center" style="width: 100%;" align="center" vertical>
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
            </NSpace>
        </NCard>

    </NSpace>

    <NSpace vertical style="width: 70%">
        <template v-if="!anyClassSelected">
            <NEmpty description="Une classe doit être sélectionnée pour procéder." />
        </template>
        <template v-else-if="tuCompletionData.length === 0">
            <NEmpty description="Aucune donnée." />
        </template>
        <template v-else>
            <TTUCompletionCard v-for="c in tuCompletionData" :data="c" @open="onTUCompletionCardOpen" />
        </template>
    </NSpace>

    <NModal preset="dialog" title="Progrès par éléments constitutifs" closable close-on-esc
        v-model:show="anyTUCompletionSelected" style="width: 70%;">
        <template v-if="ceCompletionData.length === 0">
            <NEmpty description="Aucune donnée." />
        </template>
        <template v-else>
            <NSpace vertical size="large">
                <TCECompletionCard v-for="c in ceCompletionData" :key="c.id" :data="c" />
            </NSpace>
        </template>
    </NModal>
</template>

<script setup lang="ts">
import { Options } from '@/lib/options';
import { fetchBranches } from '@/services/branches';
import { fetchClasses } from '@/services/classes';
import { fetchFields } from '@/services/fields';
import { fetchStages } from '@/services/stages';
import { fetchCECompletion, fetchTUCompletion } from '@/services/tracking';
import type { Branch } from '@/types/branch';
import type { Class } from '@/types/class';
import type { Field } from '@/types/field';
import type { Stage } from '@/types/stage';
import type { CECompletion, TUCompletion } from '@/types/tracking';
import { useLoadingBar, useMessage } from 'naive-ui';

const message = useMessage();
const loadingBar = useLoadingBar();

const fields = ref<Field[]>([]);
const branches = ref<Branch[]>([]);
const stages = ref<Stage[]>([]);
const classes = ref<Class[]>([]);

const anyClassSelected = ref(false);
const anyTUCompletionSelected = ref(false);

const filters = ref<{
    fieldId: string | null,
    branchId: string | null,
    stageId: string | null,
    classId: string | null,
    tuCompletionId: string | null,
}>({
    fieldId: null,
    branchId: null,
    stageId: null,
    classId: null,
    tuCompletionId: null,
});

const tuCompletionData = ref<TUCompletion[]>([]);
const ceCompletionData = ref<CECompletion[]>([]);

const onTUCompletionCardOpen = (tu: TUCompletion) => {
    filters.value.tuCompletionId = tu['id'];
};

watch(() => filters.value.fieldId, async (newFieldId) => {
    filters.value.branchId = null;

    if (!newFieldId) {
        branches.value = [];
        return;
    }

    branches.value = await fetchBranches(loadingBar, message, { fieldId: newFieldId })
});

watch(() => [filters.value.branchId, filters.value.stageId], async ([newBranchId, newStageId]) => {
    filters.value.classId = null;

    if (!newBranchId || !newStageId) {
        classes.value = [];
        return;
    }

    classes.value = await fetchClasses(loadingBar, message, { branchId: newBranchId, stageId: newStageId, });
});

watch(() => filters.value.classId, async (newClassId) => {
    tuCompletionData.value = [];

    if (!newClassId) {
        anyClassSelected.value = false;
        return;
    }

    anyClassSelected.value = true;
    tuCompletionData.value = await fetchTUCompletion(filters.value.stageId!, filters.value.branchId!, filters.value.classId!, loadingBar, message);
});

watch(() => filters.value.tuCompletionId, async (newTUCompletionId) => {
    ceCompletionData.value = [];

    if (!newTUCompletionId) {
        anyTUCompletionSelected.value = false;
        return;
    }

    anyTUCompletionSelected.value = true;
    ceCompletionData.value = await fetchCECompletion(newTUCompletionId, filters.value.classId!, loadingBar, message);
});

onMounted(async () => {
    fields.value = await fetchFields(loadingBar, message);
    stages.value = await fetchStages(loadingBar, message);
});
</script>