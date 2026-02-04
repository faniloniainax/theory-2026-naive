<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" :filters="filters" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { Branch } from '@/types/branch';
import type { Class } from '@/types/class';
import type { CrudAction, CrudFilter, CrudInput } from '@/types/crud';
import type { Field } from '@/types/field';
import type { Stage } from '@/types/stage';
import type { DataTableColumns } from 'naive-ui';


const url = "/mention/classes";
const params = { include: "Branch, Stage" }
const singular = "classe";
const plural = "classes";
const isMasculine = false;
const searchPlaceholder = "Rechercher...";
const formGridColumns = 1;

const filters: CrudFilter[] = [
    {
        path: 'field_id',
        placeholder: 'Mention',
        url: '/mention/fields',
        mapFn: (f: Field) => ({
            label: f['name'],
            value: f['id'],
        }),
    },
    {
        path: 'branch_id',
        placeholder: 'Parcours',
        url: '/mention/branches',
        dependentOn: 'field_id',
        mapFn: (b: Branch) => ({
            label: b['abbreviation'],
            value: b['id'],
        }),
    },
    {
        path: 'stage_id',
        placeholder: 'Niveau',
        url: '/mention/stages',
        mapFn: (s: Stage) => ({
            label: s['name'],
            value: s['id'],
        }),
    }
];

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
        url: '/mention/stages',
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
        kind: 'foreign',
        url: '/mention/branches',
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