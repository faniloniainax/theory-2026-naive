<template>
    <!-- TODO: Add search features, if at all. -->
    <NSpace justify="space-between" style="width: 100%;">
        <NInput :placeholder="searchPlaceholder" v-model:value="searchQuery" clearable>
            <template #prefix>
                <NIcon>
                    <SearchOutline />
                </NIcon>
            </template>
        </NInput>
        <NButton type="success" ghost @click="onAddClick">
            <template #icon>
                <AddOutline />
            </template>

            Ajouter {{ isMasculine ? 'un' : 'une' }} {{ singular }}
        </NButton>
    </NSpace>

    <NCollapse>
        <NCollapseItem title="Filtres" name="filters">
            <NGrid cols="4" x-gap="12">
                <NGridItem v-for="filter in filters" :key="filter.path">
                    <NSelect v-model:value="filterValues[filter.path]" filterable clearable
                        :options="filterOptions[filter.path]" :placeholder="filter.placeholder">
                        <template #empty>
                            <NEmpty description="Aucune donnée." />
                        </template>
                    </NSelect>
                </NGridItem>
            </NGrid>
        </NCollapseItem>
    </NCollapse>

    <TCrudTable :columns="columns" :plural="plural" :singular="singular" :is-masculine="isMasculine" :data="data"
        @edit="onEditClick" @delete="onDeleteClick" />
    <div style="display:flex;justify-content:flex-end;margin-top:12px;">
        <NPagination v-model:page="currentPage" :page-count="totalPages" show-size-picker :page-sizes="[5, 10, 20, 50]"
            v-model:page-size="perPage" />
    </div>
    <NModal preset="card" closable :title="title" embedded close-on-esc v-model:show="showFormModal">
        <TCrudForm :columns="formGridColumns" :inputs="formInputs" :data="e" @cancel="onFormCancel"
            @submit="onFormSubmit" />
    </NModal>
</template>

<script setup lang="ts">
import { Http } from '@/lib/http';
import type { CrudAction, CrudFilter, CrudInput } from '@/types/crud';
import { useDialog, useLoadingBar, useMessage, type DataTableColumns } from 'naive-ui';
import AddOutline from 'vicons/ionicons-v5/AddOutline.vue';
import SearchOutline from 'vicons/ionicons-v5/SearchOutline.vue';

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
    filters?: CrudFilter[];
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
    filters: [] as any,
});

const dialog = useDialog();
const message = useMessage();
const loadingBar = useLoadingBar();

const e = ref<any>({});
const data = ref<any[]>([]);
const showFormModal = ref(false);
const isEditMode = ref(false);
const title = ref("");
const searchQuery = ref("");
const filterValues = ref<Record<string, any>>({});
const filterOptions = ref<Record<string, any[]>>({});

const currentPage = ref<number>(1);
const perPage = ref<number>((props.params && props.params.per_page) ? props.params.per_page : 20);
const totalPages = ref<number>(1);
const totalEntries = ref<number>(0);

const fetchData = async () => {
    loadingBar.start();
    const p: any = { ...props.params, q: searchQuery.value, ...filterValues.value };

    p.page = currentPage.value;
    p.per_page = perPage.value;

    const res = await Http.get(props.url, { params: p });

    if (res.status !== 200) {
        message.error(`Erreur durant le chargement des ${props.plural}.`);
        data.value = [];
        loadingBar.error();
        return;
    }


    if (res.data && res.data.data !== undefined && res.data.pagination !== undefined) {
        data.value = res.data.data;
        const pg: any = res.data.pagination || {};

        totalPages.value = pg.TotalPages || pg.total_pages || 1;
        perPage.value = pg.PerPage || pg.per_page || perPage.value;
        currentPage.value = pg.Page || pg.page || currentPage.value;
        totalEntries.value = pg.TotalEntries || pg.total_entries || 0;
    } else {
        data.value = res.data;

        // Fallback to a single page
        totalPages.value = 1;
        totalEntries.value = Array.isArray(res.data) ? res.data.length : 0;
    }
    loadingBar.finish();
};

watch([currentPage, perPage], () => {
    fetchData();
});

const onAddClick = () => {
    e.value = {};
    title.value = "Ajouter " + (props.isMasculine ? 'un ' : 'une ') + props.singular;
    isEditMode.value = false;
    showFormModal.value = true;
};

const onEditClick = (otherE: any) => {
    e.value = otherE;
    title.value = "Modifier " + (props.isMasculine ? 'un ' : 'une ') + props.singular;
    isEditMode.value = true;
    showFormModal.value = true;
};

const onDeleteClick = async (e: any) => {
    dialog.error({
        content: `Voulez-vous vraiment supprimer ${(props.isMasculine ? 'ce' : 'cette')} ${props.singular} ?`,
        positiveText: 'Confirmer',
        negativeText: 'Annuler',
        onPositiveClick: async () => {
            const res = await Http.delete(`${props.url}/${e['id']}`);

            if (res.status !== 200) {
                message.error(`Erreur durant la suppression d'${(props.isMasculine) ? 'un' : 'une'} ${props.singular}.`);
                return;
            }

            message.success(`Suppression effectuée avec succès.`);
            await fetchData();
        }
    });
};

const onFormCancel = () => {
    e.value = {};
    showFormModal.value = false;
};

const onFormSubmit = async (e: any) => {
    loadingBar.start();

    if (!isEditMode.value) {
        const res = await Http.post(props.url, e);

        if (res.status !== 201) {
            message.error(`Erreur durant l'ajout d'${(props.isMasculine) ? 'un' : 'une'} ${props.singular}.`);
            showFormModal.value = false;
            loadingBar.error();
            return;
        }

        message.success("Ajout effectué avec succès.");
    } else {
        const res = await Http.put(`${props.url}/${e['id']}`, e);

        if (res.status !== 200) {
            message.error(`Erreur durant la modification d'${(props.isMasculine) ? 'un' : 'une'} ${props.singular}.`);
            showFormModal.value = false;
            loadingBar.error();
            return;
        }

        message.success("Modification effectuée avec succès.");
    }

    showFormModal.value = false;
    loadingBar.finish();
    await fetchData();
};

onMounted(async () => {
    await fetchData();

    props.filters.forEach(async (f) => {
        // Skip dependent filters initially
        if (f.dependentOn && f.dependentOn.length > 0) return;

        const p = { ...f.params };
        const res = await Http.get(f.url, { params: p });
        if (res.status === 200) {
            filterOptions.value[f.path] = res.data.map(f.mapFn);
        }
    });
});

let debounceTimer: any = null;
const debounce = (fn: Function, delay: number) => {
    return (...args: any[]) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => fn(...args), delay);
    }
}

const debouncedFetch = debounce(fetchData, 500);

watch(searchQuery, () => {
    debouncedFetch();
});

watch(() => ({ ...filterValues.value }), (newValues, oldValues) => {
    // Check if any dependencies trigger updates
    props.filters.forEach(async (f) => {
        if (!f.dependentOn || f.dependentOn.length === 0) return;

        const deps = Array.isArray(f.dependentOn) ? f.dependentOn : [f.dependentOn];

        const hasChanged = deps.some(d => newValues[d] !== oldValues[d]);

        // Check if the dependency has changed
        if (hasChanged) {
            // Clear current value
            filterValues.value[f.path] = null;

            // Check if all dependencies have values
            const allDepsHaveValues = deps.every(d => newValues[d]);

            // If the dependency is cleared, clear options too
            if (!allDepsHaveValues) {
                filterOptions.value[f.path] = [];
                return;
            }

            // Fetch new options with current filters as params
            const p = { ...filterValues.value, ...f.params };
            const res = await Http.get(f.url, { params: p });
            if (res.status === 200) {
                filterOptions.value[f.path] = res.data.map(f.mapFn);
            }
        }
    });

    fetchData();
}, { deep: true });
</script>