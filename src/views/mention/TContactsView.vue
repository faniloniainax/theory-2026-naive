<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { Contact } from '@/types/contact';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Teacher } from '@/types/teacher';
import type { DataTableColumns } from 'naive-ui';


const url = "/contacts";
const params = { include: "Teacher, Teacher.Title" }
const singular = "contact";
const plural = "contacts";
const isMasculine = true;
const searchPlaceholder = "Rechercher par numéro de téléphone...";
const formGridColumns = 1;

const columns: DataTableColumns<Contact> = [
    {
        key: 'phone_number',
        title: 'Numéro de téléphone',
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        render: c => c['teacher'] && c['teacher']['title'] ? `${c['teacher']['title']!['name']} ${c['teacher']['last_name']} ${c['teacher']['first_name']}` : Tags.getNoneTag()
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'string',
        placeholder: '034 00 000 00...',
        name: 'Numéro de téléphone',
        path: 'phone_number',
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
