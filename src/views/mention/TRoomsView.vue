<template>
    <TCrud :url="url" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { Room } from '@/types/room';
import type { DataTableColumns } from 'naive-ui';


const url = "/rooms";
const singular = "salle";
const plural = "salles";
const isMasculine = false;
const searchPlaceholder = "Rechercher par nom...";
const formGridColumns = 1;

const columns: DataTableColumns<Room> = [
    {
        key: 'name',
        title: 'Nom',
    }
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'string',
        name: 'Nom',
        path: 'name',
        required: true,
        placeholder: 'Salle 00x, Salle 1xx...',
    }
];
</script>