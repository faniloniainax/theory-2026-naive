<template>
    <NSpace justify="center" style="width: 100%;">
        <NCard>
            <NFlex vertical justify="center" align="center">
                <NH2>Enseignements par élément constitutif pour l'enseignant</NH2>
                <NSelect placeholder="Aucun élément constitutif..." filterable clearable v-model:value="constElementId"
                    :options="Options.formatConstElements(constElements)" style="min-width: 300px;">
                    <template #empty>
                        <NEmpty description="Aucune donnée." />
                    </template>
                </NSelect>
                <NDatePicker v-model:value="selectedDate" type="year" placeholder="Sélectionner une année"
                    style="min-width: 150px;" />
                <NHeatmap :loading="isLoading" :data="data" :tooltip="true" size="large">
                    <template #tooltip="{ timestamp: ts, value }">
                        {{ Dates.format(ts, 'dd MMMM yyyy') }} <br>
                        {{ value?.toString().padStart(3, '0') ?? "00" }} séance(s)
                    </template>
                    <template #indicator-leading-text>
                        Moins
                    </template>
                    <template #indicator-trailing-text>
                        Plus
                    </template>
                    <template #footer>
                        <NP :depth="3">
                            *Seules les matières associées à l'enseignant sont affichées ici.
                        </NP>
                    </template>
                </NHeatmap>
            </NFlex>
        </NCard>
    </NSpace>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Options } from '@/lib/options';
import { fetchConstElements } from '@/services/const_elements';
import { fetchActivityForTeacher } from '@/services/tracking';
import type { ConstElement } from '@/types/const_element';
import type { HeatmapData } from 'naive-ui';
import { heatmapMockData, useLoadingBar, useMessage } from 'naive-ui';

type Props = {
    classId: string | null;
    stageId: string | null;
    branchId: string | null;
    teacherId: string | null;
};

const props = defineProps<Props>();

const message = useMessage();
const loadingBar = useLoadingBar();

const data = ref<HeatmapData>([]);
const isLoading = ref(true);
const constElements = ref<ConstElement[]>([]);
const constElementId = ref<string | null>(null);
const selectedDate = ref<number | null>(new Date().getTime());

const selectedYear = computed(() => {
    return selectedDate.value ? new Date(selectedDate.value).getFullYear() : new Date().getFullYear();
});

watch(() => [props.stageId, props.branchId, props.teacherId, props.classId], async ([newStageId, newBranchId, newTeacherId, newClassId]) => {
    if (!newStageId || !newBranchId || !newTeacherId || !newClassId) {
        isLoading.value = true;
        constElementId.value = null;
        constElements.value = [];
        return;
    }

    constElements.value = await fetchConstElements(loadingBar, message, { branchId: newBranchId, stageId: newStageId, teacherId: newTeacherId });
});

watch(() => [constElementId.value, selectedYear.value], async ([newConstElementId]) => {
    if (newConstElementId === null) {
        data.value = [];
        return;
    }

    const teacherId = props.teacherId!;
    const classId = props.classId!;
    const year = selectedYear.value;

    isLoading.value = true;
    data.value = await fetchActivityForTeacher(teacherId, classId, newConstElementId as string, year, loadingBar, message);
    isLoading.value = false;
});

</script>