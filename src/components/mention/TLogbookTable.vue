<template>
    <NDataTable :columns="columns" :data="progresses">
        <template #empty>
            <NEmpty description="Aucune donnée." />
        </template>
    </NDataTable>

    <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
        <NPagination show-size-picker :page-sizes="[5, 10, 20, 50]" :page="page" :page-count="totalPages"
            :page-size="pageSize" @update:page="onUpdatePage" @update:page-size="onUpdatePageSize" />
    </div>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Http } from '@/lib/http';
import { Texts } from '@/lib/texts';
import type { Progress, ProgressBlock } from '@/types/progress';
import { formatDate } from 'date-fns';
import { NButton, NIcon, NSpace, useDialog, useLoadingBar, useMessage, type DataTableColumns } from 'naive-ui';
import EyeIcon from 'vicons/ionicons-v5/EyeOutline.vue';

type Props = {
    progresses: ProgressBlock[];
    page: number;
    pageSize: number;
    totalPages: number;
};

type Emits = {
    (event: 'click:edit', row: ProgressBlock): void;
    (event: 'click:delete', row: ProgressBlock): void;
    (event: 'click:context', row: ProgressBlock): void;
    (event: 'update:page', page: number): void;
    (event: 'update:page-size', pageSize: number): void;
    (event: 'update:total-pages', totalPages: number): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const dialog = useDialog();
const message = useMessage();
const loadingBar = useLoadingBar();

const columns: DataTableColumns<ProgressBlock> = [
    {
        key: 'date',
        title: 'Date',
        render: p => Dates.format(p['date'], 'dd MMMM yyyy'),
    },
    {
        key: 'class_id',
        title: 'Classe',
        render: p => Texts.formatClass(p['class'])
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        render: p => Texts.formatTeacher(p['teacher'])
    },
    {
        key: 'hour_part_id',
        title: 'Horaire',
        render: p => Texts.formatHourPart(p['hour_part'])
    },
    {
        key: 'const_element_id',
        title: 'EC',
        render: p => Texts.formatConstElement(p['const_element']),
    },
    {
        key: 'context',
        title: 'Contexte',
        align: 'center',
        render: (p: ProgressBlock) => h(NButton, { onClick: () => emits('click:context', p) }, () => h(NIcon, () => h(EyeIcon)))
    },
    {
        key: 'actions',
        title: 'Actions',
        align: 'center',
        render: (p: ProgressBlock) => h(NSpace, { justify: 'center' }, () => [
            h(NButton, { ghost: true, type: 'info', onClick: () => onEditClick(p) }, { default: () => 'Modifier' }),
            h(NButton, { ghost: true, type: 'error', onClick: () => onDeleteClick(p) }, { default: () => 'Supprimer' }),
        ]),
    }
];

const onEditClick = (p: ProgressBlock) => emits('click:edit', p)
const onDeleteClick = (p: ProgressBlock) => {
    dialog.error({
        content: 'Voulez-vous vraiment supprimer cet enregistrement de cours ?',
        positiveText: 'Confirmer',
        negativeText: 'Annuler',
        onPositiveClick: () => emits('click:delete', p)
    })
};

const onUpdatePage = (page: number) => emits('update:page', page);
const onUpdatePageSize = (pageSize: number) => emits('update:page-size', pageSize);
</script>