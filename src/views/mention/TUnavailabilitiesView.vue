<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Teacher } from '@/types/teacher';
import type { Unavailability } from '@/types/unavailability';
import type { DataTableColumns } from 'naive-ui';


const url = "/mention/unavailabilities";
const params = { include: "Teacher, Teacher.Title" }
const singular = "indisponibilité";
const plural = "indisponibilités";
const isMasculine = false;
const searchPlaceholder = "Rechercher par raison...";
const formGridColumns = 1;

const columns: DataTableColumns<Unavailability> = [
    {
        key: 'reason',
        title: 'Raison',
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        render: u => u['teacher'] && u['teacher']['title'] ? `${u['teacher']['title']!['name']} ${u['teacher']['last_name']} ${u['teacher']['first_name']}` : Tags.getNoneTag()
    },
    {
        key: 'beg',
        title: 'Début',
        render: u => Tags.getDateTag(u.beg)
    },
    {
        key: 'end',
        title: 'Fin',
        render: u => Tags.getDateTag(u.end)
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'string',
        placeholder: 'Rendez-vous médical, Congé...',
        name: 'Raison',
        path: 'reason',
        required: true,
    },
    {
        url: '/mention/teachers',
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
        kind: 'date',
        name: 'Début',
        path: 'beg',
        required: true,
    },
    {
        kind: 'date',
        name: 'Fin',
        path: 'end',
        required: true,
    },
];
</script>
