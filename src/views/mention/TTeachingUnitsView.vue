<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Teacher } from '@/types/teacher';
import type { TeachingUnit } from '@/types/teaching_unit';
import type { DataTableColumns } from 'naive-ui';


const url = "/teaching_units";
const params = { include: "Teacher, Teacher.Title, Branch, Stage" }
const singular = "unité d'enseignement";
const plural = "unités d'enseignement";
const isMasculine = true;
const searchPlaceholder = "Rechercher par code, par nom...";
const formGridColumns = 1;

const columns: DataTableColumns<TeachingUnit> = [
    {
        key: 'code',
        title: 'Code',
    },
    {
        key: 'name',
        title: 'Nom',
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        render: c => c['teacher'] && c['teacher']['title'] ? `${c['teacher']['title']!['name']} ${c['teacher']['last_name']} ${c['teacher']['first_name']}` : Tags.getNoneTag()
    },
    {
        key: 'stage_id',
        title: 'Promotion',
        render: c => c['stage'] ? c['stage']['name'] : Tags.getNoneTag()
    },
    {
        key: 'branch_id',
        title: 'Parcours',
        render: c => c['branch'] ? c['branch']['abbreviation'] : Tags.getNoneTag()
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'string',
        max: 50,
        min: 4,
        placeholder: 'LXYYYYYY-ZZZZZZZZ...',
        name: 'Code',
        path: 'code',
        required: true,
    },
    {
        kind: 'string',
        max: 100,
        min: 4,
        placeholder: 'Français, Anglais...',
        name: 'Nom',
        path: 'name',
        required: true,
    },
    {
        url: '/teachers',
        kind: 'foreign',
        name: 'Enseignant',
        path: 'teacher_id',
        required: true,
        params: { include: 'Title' },
        placeholder: 'Aucun enseignant...',
        plural: 'enseignants',
        mapFn: (t: Teacher) => {
            return {
                value: t['id'],
                label: `${t['title']!['name']} ${t['last_name']} ${t['first_name']}`.trim()
            }
        }
    },
    {
        url: '/stages',
        kind: 'foreign',
        name: 'Promotion',
        path: 'stage_id',
        required: true,
        placeholder: 'Sélectionner une promotion...',
        plural: 'promotions',
        mapFn: (s: any) => ({ value: s.id, label: s.name })
    },
    {
        url: '/branches',
        kind: 'foreign',
        name: 'Parcours',
        path: 'branch_id',
        required: true,
        placeholder: 'Sélectionner un parcours...',
        plural: 'parcours',
        mapFn: (b: any) => ({ value: b.id, label: b.abbreviation })
    },
];
</script>