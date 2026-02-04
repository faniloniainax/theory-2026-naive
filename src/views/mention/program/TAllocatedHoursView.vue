<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { AllocatedHour } from '@/types/allocated_hour';
import type { ConstElement } from '@/types/const_element';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { TeachingType } from '@/types/teaching_type';
import type { DataTableColumns } from 'naive-ui';


const url = "/mention/allocated_hours";
const params = { include: "ConstElement, TeachingType" }
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

const formInputs: CrudInput[] = [
    {
        kind: 'number',
        min: 1,
        max: 100,
        placeholder: '67, 26, ...',
        name: 'Valeur',
        required: true,
        path: 'quantity',
    },
    {
        url: '/mention/const_elements',
        kind: 'foreign',
        path: 'const_element_id',
        name: 'Element constitutif',
        required: true,
        placeholder: 'Aucun élement constitutif...',
        plural: 'élements constitutifs',
        mapFn: (c: ConstElement) => {
            return {
                value: c['id'],
                label: `${c['code']} - ${c['name']}`,
            };
        },
    },
    {
        url: '/mention/teaching_types',
        kind: 'foreign',
        path: 'teaching_type_id',
        name: "Type d'enseignement",
        required: true,
        placeholder: "Aucun type d'enseignement...",
        plural: "types d'enseignement",
        mapFn: (t: TeachingType) => {
            return {
                value: t['id'],
                label: t['name'],
            };
        },
    }
];
</script>