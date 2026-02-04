<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" :filters="filters" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { CrudAction, CrudFilter, CrudInput } from '@/types/crud';
import type { Rank } from '@/types/rank';
import type { Teacher } from '@/types/teacher';
import type { TeachingUnit } from '@/types/teaching_unit';
import type { Title } from '@/types/title';
import type { DataTableColumns } from 'naive-ui';


const url = "/mention/teaching_units";
const params = { include: "Stage, Branch" }
const singular = "unité d'enseignement";
const plural = "unités d'enseignements";
const isMasculine = true;
const searchPlaceholder = "Rechercher par code, nom...";
const formGridColumns = 1;

const filters: CrudFilter[] = [
];

const columns: DataTableColumns<TeachingUnit> = [
    {
        key: 'code',
        title: 'Code',
    },
    {
        key: 'name',
        title: 'Nom'
    },
    {
        key: 'stage_id',
        title: 'Niveau',
        render: t => t['stage']!['name']
    },
    {
        key: 'branch_id',
        title: 'Parcours',
        render: t => t['branch']!['abbreviation'],
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'string',
        name: 'Trilogie',
        path: 'trilogy',
        required: true,
        max: 3,
        min: 3,
        placeholder: 'FOO, BAR...',
    },
    {
        kind: 'string',
        name: 'Nom',
        path: 'last_name',
        required: true,
        max: 50,
        placeholder: 'RAKOTO, RANDRIA...',
    },
    {
        kind: 'string',
        name: 'Prénom(s)',
        path: 'first_name',
        required: false,
        max: 50,
        placeholder: 'Rabe, Koto...',
    },
    {
        kind: 'boolean',
        name: 'Permanent',
        path: 'is_permanent',
        required: true,
    },
    {
        kind: 'string',
        name: 'Adresse e-mail',
        path: 'email',
        required: true,
        max: 200,
        min: 5,
        placeholder: 'foobar@host.com...'
    },
    {
        kind: 'foreign',
        url: '/mention/titles',
        name: 'Titre',
        path: 'title_id',
        required: true,
        plural: 'titres',
        placeholder: 'Aucun titre...',
        mapFn: (title: Title) => ({
            label: title['name'],
            value: title['id'],
        }),
    },
    {
        kind: 'foreign',
        url: '/mention/ranks',
        name: 'Rang',
        path: 'rank_id',
        required: true,
        plural: 'rangs',
        placeholder: 'Aucun rang...',
        mapFn: (rank: Rank) => ({
            label: rank['name'],
            value: rank['id'],
        }),
    },
];
</script>