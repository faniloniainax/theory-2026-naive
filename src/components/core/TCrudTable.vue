<template>
    <NDataTable :data="data" :columns="actualColumns" bordered>
        <template #empty>
            <NEmpty
                :description="(isMasculine ? 'Aucun ' : 'Aucune ') + singular + (isMasculine ? ' trouvé.' : ' trouvée.')" />
        </template>
    </NDataTable>
</template>

<script setup lang="ts">
import { NButton, NSpace, type DataTableColumns } from 'naive-ui';

type Props = {
    columns: DataTableColumns<any>;
    plural: string;
    singular: string;
    isMasculine: boolean;
    data: any[];
};

const props = defineProps<Props>();

const actualColumns: DataTableColumns<any> = [
    ...props.columns,
    {
        key: '__actions',
        title: 'Actions',
        render: () => {
            return h(NSpace, null, {
                default: () => [
                    h(NButton, { type: 'info', ghost: true }, { default: () => 'Modifier' }),
                    h(NButton, { type: 'error', ghost: true }, { default: () => 'Supprimer' }),
                ]
            });
        },
    },
];
</script>