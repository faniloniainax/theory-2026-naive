<template>
    <NSpace vertical justify="center" align="stretch">
        <NSpace justify="space-between">
            <NInput placeholder="Rechercher..." clearable v-model:value="q" @update:value="onSearchUpdate">
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
            <NPagination v-model:page="page" v-model:page-size="perPage" :page-count="totalPages" show-size-picker
                @update:page="onPageUpdate" @update:page-size="onPageSizeUpdate" :page-sizes="[5, 10, 20, 50]" />
        </NSpace>
    </NSpace>

    <TLogbookModal v-model:visible="modalVisible" :course="currentCourse" :is-edit-mode @click:submit="onModalSubmit" />
    <TLogbookShowMoreModal v-model:visible="showMoreModalVisible" :course="currentCourse"
        :teaching-types="teachingTypes" />
</template>

<script setup lang="ts">
import TLogbookActions from '@/components/delegate/TLogbookActions.vue';
import useDates from '@/composables/core/useDates';
import useLoading from '@/composables/core/useLoading';
import useSearch from '@/composables/core/useSearch';
import useTexts from '@/composables/core/useTexts';
import useCourses from '@/composables/services/useCourses';
import useTeachingTypes from '@/composables/services/useTeachingTypes';
import type { Course } from '@/types/course';
import type { TeachingType } from '@/types/teaching_type';
import { NButton, NIcon, NSpace, useDialog, useMessage, type DataTableColumns } from 'naive-ui';
import AddOutline from 'vicons/ionicons-v5/AddOutline.vue';
import SearchOutline from 'vicons/ionicons-v5/SearchOutline.vue';

const dialog = useDialog();
const courses = useCourses();
const { formatDate } = useDates();
const { makeHourPartText } = useTexts();
const { runAsyncLoading } = useLoading();

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
const currentCourse = ref<Course | null>(null);
const [q, page, perPage, totalPages, modalVisible, isEditMode, showMoreModalVisible, teachingTypes] = [ref(""), ref(1), ref(5), ref(1), ref(false), ref(false), ref(false), ref<TeachingType[]>([])];
const { getTeachingTypes } = useTeachingTypes();
const debouncedSearch = useSearch().debounceAsync(getData);

async function getData(page_: number, perPage_: number, q_: string) {
    await runAsyncLoading(async () => {
        const r = await courses.getCourses(page_, perPage_, q_);

        page.value = r.pagination['page'];
        perPage.value = r.pagination['per_page'];
        totalPages.value = r.pagination['total_pages'];
        logbookCourses.value = r.data;
        return true;
    });
}

function onAddClick() {
    isEditMode.value = false;
    currentCourse.value = null;
    modalVisible.value = true;
}

function onShowMoreClick(c: Course) {
    currentCourse.value = c;
    showMoreModalVisible.value = true;
}

function onEditClick(c: Course) {
    isEditMode.value = true;
    currentCourse.value = c;
    modalVisible.value = true;
}

function onDeleteClick(c: Course) {
    dialog.error({ title: "Confirmation", content: "Voulez-vous vraiment supprimer ce cours ?" });
}

async function onPageUpdate(newPage: number) {
    await getData(newPage, perPage.value, q.value);
}

async function onPageSizeUpdate(newPageSize: number) {
    page.value = 1;
    await getData(page.value, newPageSize, q.value);
}

async function onModalSubmit() {
    modalVisible.value = false;
    await getData(page.value, perPage.value, q.value);
}

async function onSearchUpdate(q_: string) {
    page.value = 1;
    await debouncedSearch(page.value, perPage.value, q_);
}

onMounted(async () => {
    await getData(page.value, perPage.value, q.value);
    teachingTypes.value = await getTeachingTypes();
});
</script>