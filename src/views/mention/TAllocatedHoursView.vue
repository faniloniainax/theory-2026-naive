<template>
    <TCrud :url="url" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { AllocatedHour } from '@/types/allocated_hour';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { DataTableColumns } from 'naive-ui';


const url = "/allocated_hours";
const singular = "volume horaire";
const plural = "volumes horaires";
const isMasculine = true;
const searchPlaceholder = "Rechercher...";
const formGridColumns = 1;

const columns: DataTableColumns<AllocatedHour> = [
    {
        key: 'quantity',
        title: 'Valeur',
    },
    {
        key: 'const_element_id',
        title: 'Element constitutif',
        render: a => a['const_element'] ? a['const_element']['name'] : Tags.getNoneTag(),
    },
    {
        key: 'teaching_type_id',
        title: "Type d'enseignement",
        render: a => a['teaching_type'] ? a['teaching_type']['name'] : Tags.getNoneTag(),
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [];
</script>