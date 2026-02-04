<template>
    <NTree :data="treeData" :cascade="true">
        <template #empty>
            <NEmpty description="Aucune donnée..." />
        </template>
    </NTree>
</template>

<script setup lang="ts">
import type { ElementNode } from '@/types/element';
import { NButton, NSpace, type TreeOption } from 'naive-ui';

type Props = {
    tree: ElementNode[];
    constElementId: string;
};

type Emits = {};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const treeData = ref<TreeOption[]>([]);

const constructTreeSuffix = (e: ElementNode) => {
    return () => h(NSpace, null, {
        default: () => [
            () => h(NButton, {}, { default: () => 'Ajouter un enfant' }),
            () => h(NButton, {}, { default: () => 'Modifier' }),
            () => h(NButton, {}, { default: () => 'Supprimer' }),
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

watch(() => props.tree, () => {
    constructTreeData();
});
</script>