<template>
    <NTree :data="treeData" :cascade="true" :pattern="pattern">
        <template #empty>
            <NEmpty description="Aucune donnée..." />
        </template>
    </NTree>
</template>

<script setup lang="ts">
import type { ElementNode } from '@/types/element';
import { NButton, NSpace, useDialog, type TreeOption } from 'naive-ui';

type Props = {
    tree: ElementNode[];
    constElementId: string | null;
    pattern?: string;
};

type Emits = {
    (event: 'click:add-child', parentId: string): void;
    (event: 'click:edit', e: ElementNode): void;
    (event: 'click:delete', e: ElementNode): void;
};

const props = withDefaults(defineProps<Props>(), {
    pattern: ""
});
const emits = defineEmits<Emits>();

const dialog = useDialog();
const treeData = ref<TreeOption[]>([]);

const constructTreeSuffix = (e: ElementNode) => {
    return () => h(NSpace, { justify: 'end' }, {
        default: [
            () => h(NButton, { onClick: () => onAddChildClick(e['id']) }, { default: () => 'Ajouter un élément' }),
            () => h(NButton, { onClick: () => onEditClick(e) }, { default: () => 'Modifier' }),
            () => h(NButton, { onClick: () => onDeleteClick(e) }, { default: () => 'Supprimer' }),
        ]
    });
};

const constructTreeData = () => {
    const mapCallback = (e: ElementNode): TreeOption => {
        return {
            key: e['id'],
            label: e['label'],
            suffix: constructTreeSuffix(e),
            children: e['children'] ? e['children'].map(mapCallback) : undefined,
        };
    };

    treeData.value = props.tree.map(mapCallback);
};

const onAddChildClick = (parentId: string) => {
    emits('click:add-child', parentId);
};

const onEditClick = (e: ElementNode) => {
    emits('click:edit', e);
};

const onDeleteClick = (e: ElementNode) => {
    dialog.error({
        content: 'Voulez-vous vraiment supprimer cet élément ?',
        positiveText: 'Confirmer',
        negativeText: 'Annuler',
        onPositiveClick: () => emits('click:delete', e),
    });
};

watch(() => props.tree, () => {
    constructTreeData();
});
</script>