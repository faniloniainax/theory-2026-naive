<template>
    <NDataTable :data="data" :columns="columns" bordered>
        <template #empty>
            <NEmpty
                :description="(isMasculine ? 'Aucun ' : 'Aucune ') + singular + (isMasculine ? ' trouvé.' : ' trouvée.')" />
        </template>
    </NDataTable>
</template>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui';

type Props = {
    columns: DataTableColumns<any>;
    plural: string;
    singular: string;
    isMasculine: boolean;
    data: any[];
};

const props = defineProps<Props>();
</script>