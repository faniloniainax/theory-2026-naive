<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import type { CrudAction, CrudInput } from '@/types/crud';
import type { HourPart } from '@/types/hour_part';
import type { DataTableColumns } from 'naive-ui';


const url = "/hour_parts";
const params = { include: "" }
const singular = "tranche horaire";
const plural = "tranches horaires";
const isMasculine = true;
const searchPlaceholder = "Rechercher par début, par fin...";
const formGridColumns = 1;

const columns: DataTableColumns<HourPart> = [
    {
        key: 'beg',
        title: 'Début',
    },
    {
        key: 'end',
        title: 'Fin',
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'hour',
        name: 'Début',
        path: 'beg',
        required: true,
    },
    {
        kind: 'hour',
        name: 'Fin',
        path: 'end',
        required: true,
    },
];
</script>