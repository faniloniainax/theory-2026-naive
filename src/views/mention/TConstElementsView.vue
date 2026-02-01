<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { ConstElement } from '@/types/const_element';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Teacher } from '@/types/teacher';
import type { DataTableColumns } from 'naive-ui';


const url = "/const_elements";
const params = { include: "Teacher, Teacher.Title, TeachingUnit, Semester", per_page: 10 }
const singular = "élement constitutif";
const plural = "élements constitutifs";
const isMasculine = true;
const searchPlaceholder = "Rechercher par code, par nom...";
const formGridColumns = 1;

const columns: DataTableColumns<ConstElement> = [
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
        key: 'teaching_unit_id',
        title: "Unité d'enseignement",
        render: c => c['teaching_unit'] ? `${c['teaching_unit']['code']} - ${c['teaching_unit']['name']}` : Tags.getNoneTag(true),
    },
    {
        key: 'credits',
        title: 'Crédits',
    },
    {
        key: 'ponderation',
        title: 'Pondération',
    },
    {
        key: 'semester_id',
        title: 'Semestre',
        render: c => c['semester'] ? `${c['semester']['number']}` : Tags.getNoneTag()
    }
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
];
</script>