<template>
    <TCrud :url="url" :params="params" :singular="singular" :plural="plural" :is-masculine="isMasculine"
        :search-placeholder="searchPlaceholder" :form-grid-columns="formGridColumns" :columns="columns"
        :other-actions="otherActions" :form-inputs="formInputs" />
</template>

<script setup lang="ts">
import { Tags } from '@/lib/tags';
import type { Class } from '@/types/class';
import type { ConstElement } from '@/types/const_element';
import type { CrudAction, CrudInput } from '@/types/crud';
import type { HourPart } from '@/types/hour_part';
import type { ProgramElement } from '@/types/program_element';
import type { Progress } from '@/types/progress';
import type { Teacher } from '@/types/teacher';
import { format } from 'date-fns';
import type { DataTableColumns } from 'naive-ui';


const url = "/progresses";
const params = { include: "Class, Class.Branch, Class.Stage, Teacher, HourPart, ConstElement, ProgramElement" }
const singular = "progrès";
const plural = "progrès";
const isMasculine = true;
const searchPlaceholder = "Rechercher...";
const formGridColumns = 1;

const columns: DataTableColumns<Progress> = [
    {
        key: 'date',
        title: 'Date',
        render: p => format(p['date'], 'dd MMMM yyyy'),
    },
    {
        key: 'class_id',
        title: 'Classe',
        render: p => p['class'] ? `${p['class']['stage']!['name']} ${p['class']['branch']!['abbreviation']} ${p['class']['group']}` : Tags.getNoneTag(true)
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        render: p => p['teacher'] ? p['teacher']['trilogy'] : Tags.getNoneTag(),
    },
    {
        key: 'hour_part_id',
        title: 'Tranche horaire',
        render: p => p['hour_part'] ? `${p['hour_part']['beg']} - ${p['hour_part']['end']}` : Tags.getNoneTag(true),
    },
    {
        key: 'const_element_id',
        title: 'Element constitutif',
        render: p => p['const_element'] ? `${p['const_element']['code']} - ${p['const_element']['name']}` : Tags.getNoneTag(),
    },
    {
        key: 'program_element_id',
        title: 'Contexte',
        render: p => p['fallback_context'].length > 0 ? p['fallback_context'] : (p['program_element'] ? p['program_element']['label'] : Tags.getNoneTag())
    },
];

const otherActions: CrudAction[] = [];

const formInputs: CrudInput[] = [
    {
        kind: 'date',
        name: 'Date',
        path: 'date',
        placeholder: 'Date du cours...'
    },
    {
        kind: 'foreign',
        url: '/classes',
        name: 'Classe',
        path: 'class_id',
        required: true,
        params: { include: 'Stage, Branch' },
        placeholder: 'Aucune classe...',
        plural: 'classes',
        mapFn: (c: Class) => {
            return {
                value: c['id'],
                label: `${c['stage']!['name']} ${c['branch']!['abbreviation']} ${c['group'] === 0 ? "" : c['group']}`.trim()
            };
        }
    },
    {
        kind: 'foreign',
        url: '/teachers',
        name: 'Enseignant',
        path: 'teacher_id',
        required: true,
        params: { include: 'Title, Rank' },
        placeholder: 'Aucun enseignant...',
        plural: 'enseignants',
        mapFn: (t: Teacher) => {
            return {
                value: t['id'],
                label: `${t['title']!['name']} ${t['last_name']} ${t['first_name'] ?? ''}`.trim(),
            }
        }
    },
    {
        kind: 'foreign',
        url: '/hour_parts',
        name: 'Tranche horaire',
        path: 'hour_part_id',
        required: true,
        placeholder: 'Aucune tranche horaire...',
        plural: 'tranches horaires',
        mapFn: (h: HourPart) => {
            return {
                value: h['id'],
                label: `${h['beg']} - ${h['end']}`,
            };
        }
    },
    {
        kind: 'foreign',
        url: '/const_elements',
        name: 'Element constitutif',
        path: 'const_element_id',
        required: true,
        placeholder: 'Aucun élement constitutif...',
        plural: 'élements constitutifs',
        mapFn: (c: ConstElement) => {
            return {
                value: c['id'],
                label: `${c['code']} - ${c['name']}`
            };
        }
    },
    {
        kind: 'string',
        name: 'Contexte du cours',
        path: 'fallback_context',
        required: true,
        min: 10,
        max: 250,
        placeholder: 'Tout le contenu du cours...',
        textArea: true,
    }
    // {
    //     kind: 'foreign',
    //     url: '/program_elements',
    //     name: 'Element du syllabus',
    //     path: 'program_element_id',
    //     required: false,
    //     placeholder: 'Aucun élement du syllabus...',
    //     plural: 'élements du syllabus',
    //     mapFn: (p: ProgramElement) => {
    //         return {
    //             value: p['id'],
    //             label: p['label'],
    //         };
    //     }
    // }
];
</script>