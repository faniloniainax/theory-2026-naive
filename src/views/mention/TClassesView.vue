<template>
    <TCrud :url="url" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { Branch } from '@/types/branch';
import type { Class } from '@/types/class';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Stage } from '@/types/stage';
import type { DataTableColumns } from 'naive-ui';


const url = "/classes";
const singular = "classe";
const plural = "classes";
const isMasculine = false;
const searchPlaceholder = "Rechercher par groupe...";
const formGridColumns = 1;

const columns: DataTableColumns<Class> = [
    {
        key: 'branch_id',
        title: 'Parcours',
        render: c => c['branch'] ? c['branch']['abbreviation'] : Tags.getNoneTag()
    },
    {
        key: 'stage_id',
        title: 'Niveau',
        render: c => c['stage'] ? c['stage']['name'] : Tags.getNoneTag()
    },
    {
        key: 'group',
        title: 'Groupe',
    }
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'foreign',
        url: '/branches',
        path: 'branch_id',
        name: 'Parcours',
        mapFn: (b: Branch) => {
            return {
                value: b['id'],
                label: b['abbreviation'],
            };
        },
        required: true,
        placeholder: 'Aucun parcours...',
        plural: 'parcours',
    },
    {
        kind: 'foreign',
        url: '/stages',
        path: 'stage_id',
        name: 'Niveaux',
        mapFn: (s: Stage) => {
            return {
                value: s['id'],
                label: s['name'],
            };
        },
        required: true,
        placeholder: 'Aucun niveau...',
        plural: 'niveaux',
    },
    {
        kind: 'number',
        name: 'Groupe',
        path: 'group',
        required: true,
        placeholder: '1, 5, 2, ...',
        min: 0,
        max: 8,
    }
];
</script>