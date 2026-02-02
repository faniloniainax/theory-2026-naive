<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Semester } from '@/types/semester';
import type { Stage } from '@/types/stage';
import type { DataTableColumns } from 'naive-ui';


const url = "/mention/semesters";
const params = { include: "Stage" }
const singular = "semestre";
const plural = "semestres";
const isMasculine = true;
const searchPlaceholder = "Rechercher par numéro...";
const formGridColumns = 2;

const columns: DataTableColumns<Semester> = [
    {
        key: 'number',
        title: 'Numéro',
    },
    {
        key: 'stage_id',
        title: 'Promotion',
        render: s => s['stage'] ? s['stage']['name'] : Tags.getNoneTag()
    },
    {
        key: 'courses_beg',
        title: 'Début cours',
        render: s => Tags.getDateTag(s.courses_beg)
    },
    {
        key: 'courses_end',
        title: 'Fin cours',
        render: s => Tags.getDateTag(s.courses_end)
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'number',
        name: 'Numéro',
        path: 'number',
        required: true,
    },
    {
        url: '/mention/stages',
        kind: 'foreign',
        name: 'Promotion',
        path: 'stage_id',
        required: true,
        placeholder: 'Sélectionner une promotion...',
        plural: 'promotions',
        mapFn: (s: Stage) => ({ value: s.id, label: s.name })
    },
    {
        kind: 'date',
        name: 'Début des cours',
        path: 'courses_beg',
        required: true,
    },
    {
        kind: 'date',
        name: 'Fin des cours',
        path: 'courses_end',
        required: true,
    },
    {
        kind: 'date',
        name: 'Début des examens',
        path: 'exams_beg',
        required: true,
    },
    {
        kind: 'date',
        name: 'Fin des examens',
        path: 'exams_end',
        required: true,
    },
    {
        kind: 'date',
        name: 'Début des rattrapages',
        path: 'retrials_beg',
        required: true,
    },
    {
        kind: 'date',
        name: 'Fin des rattrapages',
        path: 'retrials_end',
        required: true,
    },
];
</script>
