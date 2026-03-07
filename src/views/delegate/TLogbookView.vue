<template>
    <NSpace vertical justify="center" align="stretch">
        <NSpace justify="space-between">
            <NInput placeholder="Rechercher..." clearable>
                <template #prefix>
                    <NIcon size="large">
                        <SearchOutline />
                    </NIcon>
                </template>
            </NInput>
            <NButton type="success" ghost>
                <template #icon>
                    <NIcon size="large">
                        <AddOutline />
                    </NIcon>
                </template>
            </NButton>
        </NSpace>

        <NDataTable striped size="small" default-expand-all max-height="500" :row-key="r => r['id']"
            :columns="logbookColumns" :data="logbookCourses">
        </NDataTable>
    </NSpace>
</template>

<script setup lang="ts">
import TLogbookActions from '@/components/delegate/TLogbookActions.vue';
import useDates from '@/composables/core/useDates';
import useTexts from '@/composables/core/useTexts';
import type { Course } from '@/types/course';
import { NButton, NIcon, NSpace, useDialog, useMessage, type DataTableColumns } from 'naive-ui';
import AddOutline from 'vicons/ionicons-v5/AddOutline.vue';
import SearchOutline from 'vicons/ionicons-v5/SearchOutline.vue';

const dialog = useDialog();
const message = useMessage();
const { formatDate } = useDates();
const { makeHourPartText } = useTexts();

const logbookColumns: DataTableColumns<Course> = [
    {
        key: 'date',
        title: 'Date',
        width: 58,
        ellipsis: {
            tooltip: true,
        },
        render: (c: Course) => formatDate(c['date'], 'dd/MM'),
    },
    {
        key: 'hour_part_id',
        title: 'Heure',
        render: (c: Course) => makeHourPartText(c['hour_part']),
        ellipsis: {
            tooltip: true,
        }
    },
    {
        key: 'const_element_id',
        title: 'Matière',
        render: (c: Course) => c['const_element'] ? c['const_element']['code'] : '<AUCUNE>',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        key: 'teacher_id',
        title: 'Res.',
        render: (c: Course) => c['teacher'] ? c['teacher']['trilogy'] : '<AUCUN>',
        width: 48,
        ellipsis: {
            tooltip: true,
        }
    },
    {
        type: 'expand',
        width: 28,
        align: 'center',
        renderExpand: (c: Course) => {
            return h(TLogbookActions, { "onClick:show-more": () => onShowMoreClick(c), "onClick:edit": () => onEditClick(c), "onClick:delete": () => onDeleteClick(c) });
        }
    }
];

const logbookCourses: Course[] = [
    {
        id: '0e235a4c-aeb0-404d-89fa-3d0280576a39',
        date: new Date().toISOString(),
        const_element: {
            code: 'ANL1',
        },
        teacher: {
            trilogy: 'BEN',
        }
    },
    {
        id: '5a5e1159-8840-420e-8aca-42f4c70bee66',
        date: new Date().toISOString(),
        const_element: {
            code: 'ALG1',
        },
        teacher: {
            trilogy: 'ANG',
        }
    },
    {
        id: '7e41dd41-2bd1-4cf8-8776-50068248f2a3',
        date: new Date().toISOString(),
        const_element: {
            code: 'ADOMC',
        },
        teacher: {
            trilogy: 'RAB',
        }
    },
    {
        id: '4f75e5a7-56fd-4741-a727-e98ac908b41e',
        date: new Date().toISOString(),
        const_element: {
            code: 'SYSWIN',
        },
        teacher: {
            trilogy: 'FON',
        }
    },
    {
        id: '617442fe-c3d2-41fe-932f-63a0c6b8de07',
        date: new Date().toISOString(),
        const_element: {
            code: 'COMPALGO',
        },
        teacher: {
            trilogy: 'CYP',
        }
    },
    {
        id: '50bcece2-01c4-45cf-b8e1-1c18329564e1',
        date: new Date().toISOString(),
        const_element: {
            code: 'MTU'
        },
        teacher: {
            trilogy: 'VIC',
        }
    },
];

function onShowMoreClick(c: Course) {
    dialog.success({ title: "Voir plus", content: JSON.stringify(c) });
}

function onEditClick(c: Course) {
    dialog.info({ title: "Modifier", content: JSON.stringify(c) });
}

function onDeleteClick(c: Course) {
    dialog.error({ title: "Confirmation", content: "Voulez-vous vraiment supprimer ce cours ?" });
}
</script>