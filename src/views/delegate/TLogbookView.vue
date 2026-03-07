<template>
    <NFlex vertical justify="space-between" align="stretch" class="logbook-root">
        <NSpace justify="space-between">
            <NInput
                placeholder="Rechercher par date, enseignant, tranche horaire, élément constitutif, ou par contexte..."
                style="width: 500px;">
                <template #prefix>
                    <NIcon>
                        <SearchOutline />
                    </NIcon>
                </template>
            </NInput>
            <NButton>
                <template #icon>
                    <AddOutline />
                </template>
                Enregistrer un cours
            </NButton>
        </NSpace>
    </NFlex>

    <NDataTable size="small" :data="data" :columns="columns" style="flex: 1; min-height: 0; overflow: auto;">
        <template #empty>
            <NEmpty description="Aucune donnée sur le cahier de texte." />
        </template>
    </NDataTable>
</template>


<script setup lang="ts">
import type { Course } from '@/types/course';
import { formatDate } from 'date-fns';
import { NButton, NSpace, type DataTableColumns } from 'naive-ui';

import SearchOutline from 'vicons/ionicons-v5/SearchOutline.vue';
import AddOutline from 'vicons/ionicons-v5/AddOutline.vue';
import { Tags } from '@/lib/tags';

const columns: DataTableColumns<Course> = [
    {
        key: 'date',
        title: 'Date',
        render: p => formatDate(p['date'], 'dd MMMM yyyy')
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        align: 'center',
        render: p => p['teacher'] ? p['teacher']['trilogy'] : Tags.getNoneTag(),
    },
    {
        key: 'hour_part_id',
        title: 'Horaire',
        align: 'center',
        render: p => p['hour_part'] ? p['hour_part']['id'] : Tags.getNoneTag(true),
    },
    {
        key: 'const_element_id',
        title: 'Matière',
        align: 'center',
        render: p => p['const_element'] ? p['const_element']['name'] : Tags.getNoneTag(),
    },
    // {
    //     key: 'program_element_id',
    //     title: 'Contexte du cours',
    //     // render: p => p['fallback_context'] ? p['fallback_context'] : (p['program_element'] ? p['program_element']['label'] : Tags.getNoneTag()),
    // },
    {
        key: 'actions',
        title: 'Actions',
        width: 200,
        align: 'center',
        render: () => h(NSpace, null, {
            default: () => [
                h(NButton, { type: 'info', size: 'small', ghost: true }, { default: () => 'M' }),
                h(NButton, { type: 'error', size: 'small', ghost: true }, { default: () => 'S' })
            ]
        })
    }
];

const data: Course[] = [
    {
        id: "FOOBAR",
        date: new Date().toISOString(),
        room_id: "ROOMID",
        class_id: "CLASSID",
        teacher_id: "TEACHERID",
        hour_part_id: "HOURPARTID",
        const_element_id: "CONSTELEMENTID",
    }
]
</script>

<style scoped>
.logbook-root {
    flex: 1;
    min-height: 0;
}
</style>