<template>
    <NDataTable :columns="columns" :data="data">
        <template #empty>
            <NEmpty description="Aucune donnée." />
        </template>
    </NDataTable>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Http } from '@/lib/http';
import { Texts } from '@/lib/texts';
import type { Progress, ProgressBlock } from '@/types/progress';
import { formatDate } from 'date-fns';
import { NButton, NIcon, NSpace, useDialog, useLoadingBar, useMessage, type DataTableColumns } from 'naive-ui';
import EyeIcon from 'vicons/ionicons-v5/EyeOutline.vue';

type Emits = {
    (event: 'click:edit', row: ProgressBlock): void;
    (event: 'click:delete', row: ProgressBlock): void;
};

const emits = defineEmits<Emits>();

const dialog = useDialog();
const message = useMessage();
const loadingBar = useLoadingBar();

const columns: DataTableColumns<ProgressBlock> = [
    {
        key: 'date',
        title: 'Date',
        render: p => Dates.format(p['date'], 'dd MMMM yyyy'),
    },
    {
        key: 'class_id',
        title: 'Classe',
        render: p => Texts.formatClass(p['class'])
    },
    {
        key: 'teacher_id',
        title: 'Enseignant',
        render: p => Texts.formatTeacher(p['teacher'])
    },
    {
        key: 'hour_part_id',
        title: 'Horaire',
        render: p => Texts.formatHourPart(p['hour_part'])
    },
    {
        key: 'const_element_id',
        title: 'EC',
        render: p => Texts.formatConstElement(p['const_element']),
    },
    {
        key: 'context',
        title: 'Contexte',
        align: 'center',
        render: (p: ProgressBlock) => h(NButton, [
            h(NIcon, [
                h(EyeIcon)
            ])
        ])
    },
    {
        key: 'actions',
        title: 'Actions',
        align: 'center',
        render: (p: ProgressBlock) => h(NSpace, { justify: 'center' }, [
            h(NButton, { ghost: true, type: 'info', onClick: () => onEditClick(p) }, { default: () => 'Modifier' }),
            h(NButton, { ghost: true, type: 'error', onClick: () => onDeleteClick(p) }, { default: () => 'Supprimer' }),
        ]),
    }
];

const data = ref<ProgressBlock[]>([]);

const onEditClick = (p: ProgressBlock) => emits('click:edit', p)
const onDeleteClick = (p: ProgressBlock) => {
    dialog.error({
        content: 'Voulez-vous vraiment supprimer cet enregistrement de cours ?',
        positiveText: 'Confirmer',
        negativeText: 'Annuler',
        onPositiveClick: () => emits('click:delete', p)
    })
};

onMounted(async () => {
    loadingBar.start();

    try {
        const p = { include: 'Class.Stage, Class.Branch, Teacher.Title, HourPart, ConstElement' };
        const res = await Http.get("/progresses", { params: p });

        if (res.status !== 200)
            throw Error("Unexpected error.");

        data.value = res.data;
        loadingBar.finish();
    } catch (e) {
        loadingBar.error();
        message.error("Une erreur s'est produite durant le chargement des enregistrements de cours.");
    }
})
</script>