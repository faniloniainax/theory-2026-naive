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
            <NButton type="success" ghost @click="onAddClick">
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
        <NSpace justify="center">
            <NPagination v-model:page="page" v-model:page-size="pageSize" :page-count show-size-picker
                :page-sizes="[5, 10, 20, 50]" />
        </NSpace>
    </NSpace>

    <TLogbookModal v-model:visible="modalVisible" :is-edit-mode />
</template>

<script setup lang="ts">
import TLogbookActions from '@/components/delegate/TLogbookActions.vue';
import useDates from '@/composables/core/useDates';
import useTexts from '@/composables/core/useTexts';
import useCourses from '@/composables/services/useCourses';
import type { Course } from '@/types/course';
import { NButton, NIcon, NSpace, useDialog, useMessage, type DataTableColumns } from 'naive-ui';
import AddOutline from 'vicons/ionicons-v5/AddOutline.vue';
import SearchOutline from 'vicons/ionicons-v5/SearchOutline.vue';

const dialog = useDialog();
const message = useMessage();
const courses = useCourses();
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

const logbookCourses = ref<Course[]>([]);
const [page, pageSize, pageCount, modalVisible, isEditMode] = [ref(1), ref(10), ref(1), ref(false), ref(false)];

function onAddClick() {
    isEditMode.value = false;
    modalVisible.value = true;
}

function onShowMoreClick(c: Course) {
    dialog.success({ title: "Voir plus", content: JSON.stringify(c) });
}

function onEditClick(c: Course) {
    dialog.info({ title: "Modifier", content: JSON.stringify(c) });
}

function onDeleteClick(c: Course) {
    dialog.error({ title: "Confirmation", content: "Voulez-vous vraiment supprimer ce cours ?" });
}

onMounted(async () => {
    logbookCourses.value = await courses.getAllCourses();
    console.log(logbookCourses.value);
});
</script>