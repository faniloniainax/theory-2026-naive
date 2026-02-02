<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" :filters="filters" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { ConstElement } from '@/types/const_element';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Rank } from '@/types/rank';
import type { Teacher } from '@/types/teacher';
import type { Title } from '@/types/title';
import type { DataTableColumns } from 'naive-ui';


const url = "/mention/teachers";
const params = { include: "Title, Rank" }
const singular = "enseignant";
const plural = "enseignants";
const isMasculine = true;
const searchPlaceholder = "Rechercher par nom...";
const formGridColumns = 1;

const filters = [
    {
        path: 'title_id',
        placeholder: 'Titre',
        url: '/mention/titles',
        mapFn: (title: Title) => ({
            label: title['name'],
            value: title['id'],
        }),
    },
    {
        path: 'rank_id',
        placeholder: 'Grade',
        url: '/mention/ranks',
        mapFn: (rank: Rank) => ({
            label: rank['name'],
            value: rank['id'],
        }),
    },
];

const columns: DataTableColumns<Teacher> = [
    {
        key: 'trilogy',
        title: 'Trilogie',
    },
    {
        key: 'id',
        title: 'Nom complet',
        render: (t: Teacher) => `${t['title']!['name']} ${t['last_name']} ${t['first_name']}`,
    },
    {
        key: 'rank_id',
        title: 'Grade',
        render: (t: Teacher) => t['rank'] ? t['rank']['name'] : Tags.getNoneTag(),
    },
    {
        key: 'title_id',
        title: 'Titre',
        render: (t: Teacher) => t['title'] ? t['title']['name'] : Tags.getNoneTag(),
    },
    {
        key: 'email',
        title: 'Email',
    },
    {
        key: 'is_permanent',
        title: 'Permanent',
        render: (t: Teacher) => Tags.getYesOrNoTag(t['is_permanent']),
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