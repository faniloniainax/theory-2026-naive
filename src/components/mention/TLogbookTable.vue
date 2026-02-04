<template>
    <NDataTable :columns="columns" :data="courses">
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
import { Texts } from '@/lib/texts';
import type { Course } from '@/types/course';
import { NButton, NIcon, NSpace, useDialog, useLoadingBar, useMessage, type DataTableColumns } from 'naive-ui';
import EyeIcon from 'vicons/ionicons-v5/EyeOutline.vue';

type Props = {
    courses: Course[];
    page: number;
    pageSize: number;
    totalPages: number;
};

type Emits = {
    (event: 'click:edit', row: Course): void;
    (event: 'click:delete', row: Course): void;
    (event: 'click:context', row: Course): void;
    (event: 'update:page', page: number): void;
    (event: 'update:page-size', pageSize: number): void;
    (event: 'update:total-pages', totalPages: number): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const dialog = useDialog();

const columns: DataTableColumns<Course> = [
    {
        key: 'date',
        title: 'Date',
        render: c => Dates.format(c['date'], 'dd MMMM yyyy'),
    },
    {
        key: 'room',
        title: 'Salle',
        render: c => c['room']!['name'],
    },
    {
        key: 'class_id',
        title: 'Classe',
        render: c => Texts.formatClass(c['class'])
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        render: c => Texts.formatTeacher(c['teacher'])
    },
    {
        key: 'hour_part_id',
        title: 'Horaire',
        render: c => Texts.formatHourPart(c['hour_part'])
    },
    {
        key: 'const_element_id',
        title: 'EC',
        render: c => Texts.formatConstElement(c['const_element']),
    },
    {
        key: 'context',
        title: 'Contexte',
        align: 'center',
        render: (c: Course) => h(NButton, { onClick: () => emits('click:context', c) }, () => h(NIcon, () => h(EyeIcon)))
    },
    {
        key: 'actions',
        title: 'Actions',
        align: 'center',
        render: (c: Course) => h(NSpace, { justify: 'center' }, () => [
            h(NButton, { ghost: true, type: 'info', onClick: () => onEditClick(c) }, { default: () => 'Modifier' }),
            h(NButton, { ghost: true, type: 'error', onClick: () => onDeleteClick(c) }, { default: () => 'Supprimer' }),
        ]),
    }
];

const onEditClick = (c: Course) => emits('click:edit', c)
const onDeleteClick = (c: Course) => {
    dialog.error({
        content: 'Voulez-vous vraiment supprimer cet enregistrement de séance ?',
        positiveText: 'Confirmer',
        negativeText: 'Annuler',
        onPositiveClick: () => emits('click:delete', c)
    })
};

const onUpdatePage = (page: number) => emits('update:page', page);
const onUpdatePageSize = (pageSize: number) => emits('update:page-size', pageSize);
</script>