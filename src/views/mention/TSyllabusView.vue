<template>
    <NSpace justify="space-between" align="center" style="width: 100%;">
        <NSpace>
            <NInput style="width: 300px;" type="text" placeholder="Rechercher par libellé..." clearable
                :disabled="!shouldLoadSyllabusData" v-model:value="filters.q">
                <template #prefix>
                    <NIcon>
                        <SearchOutline />
                    </NIcon>
                </template>
            </NInput>
        </NSpace>

        <NSpace justify="center" align="center">
            <NCard>
                <NSpace justify="center" align="center">
                    <NSelect style="width: 200px;" filterable clearable placeholder="Aucune mention..."
                        v-model:value="filters.fieldId" :options="Options.formatFields(fields)">
                        <template #empty>
                            <NEmpty description="Aucune donnée..." />
                        </template>
                    </NSelect>
                    <NSelect style="width: 160px;" filterable clearable placeholder="Aucun parcours..."
                        v-model:value="filters.branchId" :options="Options.formatBranches(branches)">
                        <template #empty>
                            <NEmpty description="Aucune donnée..." />
                        </template>
                    </NSelect>
                    <NSelect style="width: 150px;" filterable clearable placeholder="Aucun niveau..."
                        v-model:value="filters.stageId" :options="Options.formatStages(stages)">
                        <template #empty>
                            <NEmpty description="Aucune donnée..." />
                        </template>
                    </NSelect>
                    <NSelect style="width: 500px;" filterable clearable placeholder="Aucun élément constitutif..."
                        v-model:value="filters.constElementId" :options="Options.formatConstElements(constElements)">
                        <template #empty>
                            <NEmpty description="Aucune donnée..." />
                        </template>
                    </NSelect>

                    <NButton ghost type="success" :disabled="!shouldLoadSyllabusData" @click="onAddRootElementClick">
                        <template #icon>
                            <NIcon>
                                <AddOutline />
                            </NIcon>
                        </template>
                        Ajouter un élément racine
                    </NButton>
                </NSpace>
            </NCard>
        </NSpace>
    </NSpace>

    <NFlex justify="center" style="width: 100%;">
        <template v-if="!shouldLoadSyllabusData">
            <NEmpty
                description="Sélectionnez une mention, un parcours, un niveau, et un élément constitutif pour charger les données." />
        </template>
        <template v-else>
            <TSyllabusTree :tree="elementNodes" :const-element-id="filters.constElementId" :pattern="treePattern"
                @click:add-child="onAddChildClick" @click:edit="onEditClick" @click:delete="onDeleteClick"
                @drag-n-drop="onDragNDrop" />
        </template>
    </NFlex>

    <TSyllabusForm v-model:show="shouldShowElementForm" :is-edit-mode="isEditMode" :const-elements="constElements"
        :const-element-id="filters.constElementId" :element="element" @submit="onFormSubmit" />
</template>

<script setup lang="ts">
import { Options } from '@/lib/options';
import { Store } from '@/lib/store';
import { fetchBranches } from '@/services/branches';
import { fetchConstElements } from '@/services/const_elements';
import { addElement, deleteElement, editElement, fetchElementsNodeTree } from '@/services/elements';
import { fetchFields } from '@/services/fields';
import { fetchStages } from '@/services/stages';
import type { Branch } from '@/types/branch';
import type { ConstElement } from '@/types/const_element';
import type { ElementNode } from '@/types/element';
import type { Field } from '@/types/field';
import type { Stage } from '@/types/stage';
import { useLoadingBar, useMessage } from 'naive-ui';
import SearchOutline from 'vicons/ionicons-v5/SearchOutline.vue';
import AddOutline from 'vicons/ionicons-v5/AddOutline.vue';

const message = useMessage();
const loadingBar = useLoadingBar();

const fields = ref<Field[]>([]);
const branches = ref<Branch[]>([]);
const stages = ref<Stage[]>([]);
const constElements = ref<ConstElement[]>([]);
const elementNodes = ref<ElementNode[]>([]);

const filters = ref<{
    q: string | null,
    fieldId: string | null,
    branchId: string | null,
    stageId: string | null,
    constElementId: string | null,
}>({
    q: null,
    fieldId: null,
    branchId: null,
    stageId: null,
    constElementId: null,
});

const treePattern = ref("");
const isEditMode = ref(false);
const shouldShowElementForm = ref(false);
const shouldLoadSyllabusData = ref(false);
const element = ref<ElementNode | null>(null);

const fetchData = async () => {
    const ceId = filters.value.constElementId;

    if (!ceId) {
        shouldLoadSyllabusData.value = false;
        elementNodes.value = [];
        return;
    }

    shouldLoadSyllabusData.value = true;
    elementNodes.value = await fetchElementsNodeTree(ceId, loadingBar, message);
};

const onAddRootElementClick = () => {
    element.value = {
        const_element_id: filters.value.constElementId,
    } as ElementNode;
    isEditMode.value = false;
    shouldShowElementForm.value = true;
};

const onAddChildClick = (parentId: string) => {
    element.value = {
        parent_id: parentId,
        const_element_id: filters.value.constElementId,
    } as ElementNode;
    isEditMode.value = false;
    shouldShowElementForm.value = true;
};

const onEditClick = (e: ElementNode) => {
    element.value = e;
    isEditMode.value = true;
    shouldShowElementForm.value = true;
};

const onDeleteClick = async (e: ElementNode) => {
    const ok = await deleteElement(e['id'], loadingBar, message);

    if (ok)
        await fetchData();
};

const onFormSubmit = async (e: ElementNode) => {
    let ok = true;

    if (!isEditMode.value)
        ok = await addElement(e, loadingBar, message);
    else
        ok = await editElement(e['id'], e, loadingBar, message);

    if (ok) {
        shouldShowElementForm.value = false;
        await fetchData();
    }
};

const onDragNDrop = async (e: ElementNode) => {
    const ok = await editElement(e['id'], e, loadingBar, message);

    if (ok)
        await fetchData();
};

watch(filters, (newFilters) => {
    Store.store('syllabus-filters', newFilters);
}, { deep: true });

watch(() => filters.value.fieldId, async (newFieldId) => {
    filters.value.branchId = null;

    if (!newFieldId) {
        branches.value = [];
        return;
    }

    branches.value = await fetchBranches(loadingBar, message, { fieldId: newFieldId });
});

watch(() => [filters.value.branchId, filters.value.stageId], async ([newBranchId, newStageId]) => {
    filters.value.constElementId = null;

    if (!newBranchId || !newStageId) {
        constElements.value = [];
        return;
    }

    constElements.value = await fetchConstElements(loadingBar, message, { branchId: newBranchId, stageId: newStageId });
});

watch(() => filters.value.constElementId, async () => {
    await fetchData();
});

let debounceTimer: any = null;
const debounce = (fn: Function, delay: number) => {
    return (...args: any[]) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => fn(...args), delay);
    }
}

const debouncedFetch = debounce((newQ: string | null) => {
    if (!newQ)
        treePattern.value = "";
    else
        treePattern.value = newQ;
}, 200);

watch(() => filters.value.q, (newQ) => {
    debouncedFetch(newQ);
});

onMounted(async () => {
    const parsed = Store.load<typeof filters.value>('syllabus-filters');

    fields.value = await fetchFields(loadingBar, message);
    stages.value = await fetchStages(loadingBar, message);

    if (parsed?.fieldId) {
        filters.value.fieldId = parsed.fieldId;
        branches.value = await fetchBranches(loadingBar, message, { fieldId: parsed.fieldId });
    }

    if (parsed?.branchId && parsed.stageId) {
        filters.value.stageId = parsed.stageId;
        filters.value.branchId = parsed.branchId;
        constElements.value = await fetchConstElements(loadingBar, message, {
            branchId: parsed.branchId,
            stageId: parsed.stageId,
        })
    }

    if (parsed?.constElementId) {
        filters.value.constElementId = parsed.constElementId;
    }

    if (parsed?.q) {
        filters.value.q = parsed.q;
    }
});
</script>