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

type Emits = {
    (event: 'edit', e: any): void;
    (event: 'delete', e: any): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const actualColumns: DataTableColumns<any> = [
    ...props.columns,
    {
        key: '__actions',
        title: 'Actions',
        width: 220,
        align: 'center',
        render: (e: any) => {
            return h(NSpace, null, {
                default: () => [
                    h(NButton, { type: 'info', ghost: true, onClick: () => emits('edit', e) }, { default: () => 'Modifier' }),
                    h(NButton, { type: 'error', ghost: true, onClick: () => emits('delete', e) }, { default: () => 'Supprimer' }),
                ]
            });
        },
    },
];
</script>