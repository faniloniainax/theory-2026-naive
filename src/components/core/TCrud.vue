<template>
    <!-- TODO: Add search features, if at all. -->

    <TCrudTable :columns="columns" :plural="plural" :singular="singular" :is-masculine="isMasculine" :data="data" />
    <NModal preset="card" closable :title="title" embedded close-on-esc>
        <TCrudForm :columns="formGridColumns" :inputs="formInputs" :data="e" />
    </NModal>
</template>

<script setup lang="ts">
import { Http } from '@/lib/http';
import type { CrudAction, CrudInput } from '@/types/crud';
import { useMessage, type DataTableColumns } from 'naive-ui';

type Props = {
    url: string;
    singular?: string;
    plural?: string;
    params?: any;
    isMasculine?: boolean;
    columns?: DataTableColumns<any>;
    searchPlaceholder?: string;
    otherActions?: CrudAction[];
    formInputs?: CrudInput[];
    formGridColumns?: number;
};

const props = withDefaults(defineProps<Props>(), {
    singular: "entité",
    plural: "entités",
    params: null,
    isMasculine: false,
    columns: [] as any,
    searchPlaceholder: "Rechercher...",
    otherActions: [] as any,
    formInputs: [] as any,
    formGridColumns: 1,
});

const message = useMessage();

const e = ref<any>({});
const data = ref<any[]>([]);
const showFormModal = ref(false);
const title = ref("");

onMounted(async () => {
    const res = await Http.get(props.url, { params: props.params });

    if (res.status !== 200) {
        message.error(`Erreur durant le chargement des ${props.plural}.`);
        data.value = [];
        return;
    }

    data.value = res.data;
});
</script>