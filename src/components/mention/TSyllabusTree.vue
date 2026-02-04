<template>
    <NTree block-line style="width: 100%;" :data="treeData" :cascade="true" :pattern="pattern"
        :render-suffix="renderSuffix">
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

const renderSuffix = ({ option: o }: { option: TreeOption }) => {
    return h(NSpace, { justify: 'end' }, {
        default: () => [
            h(NButton, { ghost: true, type: 'success', onClick: () => onAddChildClick(o.key as string) }, { default: () => 'Ajouter un élément' }),
            h(NButton, { ghost: true, type: 'info', onClick: () => onEditClick(o as any) }, { default: () => 'Modifier' }),
            h(NButton, { ghost: true, type: 'error', onClick: () => onDeleteClick(o as any) }, { default: () => 'Supprimer' }),
        ]
    })
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