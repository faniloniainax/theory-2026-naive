<template>
    <NSpace vertical size="large">
        <NCard>
            <NGrid cols="4" x-gap="12">
                <NGridItem>
                    <NSelect v-model:value="teachingUnitId" :options="teachingUnitOptions" filterable clearable
                        placeholder="Filtrer par Unité d'Enseignement" />
                </NGridItem>
                <NGridItem>
                    <NSelect v-model:value="constElementId" :options="constElementOptions" filterable clearable
                        placeholder="Filtrer par Elément Constitutif" :disabled="!teachingUnitId">
                        <template #empty>
                            <NEmpty description="Sélectionnez une UE d'abord" />
                        </template>
                    </NSelect>
                </NGridItem>
            </NGrid>
        </NCard>

        <div v-if="constElementId">
            <NSpace justify="space-between" style="width: 100%; margin-bottom: 20px;">
                <NInput placeholder="Rechercher par label..." v-model:value="searchQuery" clearable>
                    <template #prefix>
                        <NIcon>
                            <SearchOutline />
                        </NIcon>
                    </template>
                </NInput>
                <NButton type="success" ghost @click="onAddRootClick">
                    <template #icon>
                        <AddOutline />
                    </template>
                    Ajouter
                </NButton>
            </NSpace>

            <NTree block-line :data="data" key-field="key" label-field="label" children-field="children"
                :render-suffix="renderSuffix" selectable default-expand-all>
                <template #empty>
                    <NEmpty description="Aucune donnée." />
                </template>
            </NTree>
        </div>
        <div v-else>
            <NEmpty description="Veuillez sélectionner un Elément Constitutif pour voir le programme."
                style="margin-top: 50px;" />
        </div>
    </NSpace>

    <NModal preset="card" closable :title="formTitle" embedded close-on-esc v-model:show="showFormModal">
        <NForm :model="formModel" label-placement="left" label-width="auto">
            <NFormItem label="Label" path="label">
                <NInput v-model:value="formModel.label" placeholder="Label de l'élément" />
            </NFormItem>
        </NForm>
        <template #footer>
            <NSpace justify="end">
                <NButton @click="showFormModal = false">Annuler</NButton>
                <NButton type="primary" @click="onFormSubmit" :loading="loading">Valider</NButton>
            </NSpace>
        </template>
    </NModal>
</template>

<script setup lang="ts">
import { Http } from '@/lib/http';
import type { ConstElement } from '@/types/const_element';
import type { TeachingUnit } from '@/types/teaching_unit';
import { NButton, NCard, NEmpty, NForm, NFormItem, NGrid, NGridItem, NIcon, NInput, NModal, NSelect, NSpace, NTree, useDialog, useLoadingBar, useMessage, type TreeOption } from 'naive-ui';
import AddOutline from 'vicons/ionicons-v5/AddOutline.vue';
import CreateOutline from 'vicons/ionicons-v5/CreateOutline.vue';
import SearchOutline from 'vicons/ionicons-v5/SearchOutline.vue';
import TrashOutline from 'vicons/ionicons-v5/TrashOutline.vue';
import { h, onMounted, ref, watch } from 'vue';

const url = "/mention/program_elements";

const message = useMessage();
const dialog = useDialog();
const loadingBar = useLoadingBar();
const loading = ref(false);

const data = ref<any[]>([]);
const searchQuery = ref("");
const teachingUnitId = ref<string | null>(null);
const teachingUnitOptions = ref<any[]>([]);
const constElementId = ref<string | null>(null);
const constElementOptions = ref<any[]>([]);

const showFormModal = ref(false);
const formTitle = ref("");
const formModel = ref<any>({});
const isEditMode = ref(false);

const fetchTeachingUnits = async () => {
    const res = await Http.get("/mention/teaching_units");
    if (res.status === 200) {
        teachingUnitOptions.value = res.data.map((t: TeachingUnit) => ({
            label: t.name,
            value: t.id
        }));
    }
};

const fetchConstElements = async () => {
    if (!teachingUnitId.value) {
        constElementOptions.value = [];
        return;
    }
    const res = await Http.get("/mention/const_elements", { params: { teaching_unit_id: teachingUnitId.value } });
    if (res.status === 200) {
        constElementOptions.value = res.data.map((c: ConstElement) => ({
            label: `${c.name} (${c.code})`,
            value: c.id
        }));
    }
};

const fetchData = async () => {
    if (!constElementId.value) {
        data.value = [];
        return;
    }

    loadingBar.start();
    const res = await Http.get(url, {
        params: {
            q: searchQuery.value,
            const_element_id: constElementId.value,
            tree: true
        }
    });

    if (res.status !== 200) {
        message.error("Erreur durant le chargement des éléments de programme.");
        loadingBar.error();
        return;
    }

    data.value = res.data;
    loadingBar.finish();
};

const onAddRootClick = () => {
    formModel.value = { const_element_id: constElementId.value };
    formTitle.value = "Ajouter un élément racine";
    isEditMode.value = false;
    showFormModal.value = true;
};

const onAddChildClick = (parent: any) => {
    formModel.value = {
        const_element_id: constElementId.value,
        parent_id: parent.id
    };
    formTitle.value = "Ajouter un sous-élément";
    isEditMode.value = false;
    showFormModal.value = true;
};

const onEditClick = (node: any) => {
    formModel.value = { ...node };
    formTitle.value = "Modifier l'élément";
    isEditMode.value = true;
    showFormModal.value = true;
};

const onDeleteClick = (node: any) => {
    dialog.error({
        content: "Voulez-vous vraiment supprimer cet élément et tous ses enfants ?",
        positiveText: "Supprimer",
        negativeText: "Annuler",
        onPositiveClick: async () => {
            loadingBar.start();
            const res = await Http.delete(`${url}/${node.id}`);
            if (res.status === 200) {
                message.success("Suppression effectuée.");
                await fetchData();
            } else {
                message.error("Erreur lors de la suppression.");
                loadingBar.error();
            }
            loadingBar.finish();
        }
    });
};

const onFormSubmit = async () => {
    if (!formModel.value.label) {
        message.warning("Le label est requis.");
        return;
    }

    loading.value = true;
    loadingBar.start();
    let res;

    try {
        if (isEditMode.value) {
            res = await Http.put(`${url}/${formModel.value.id}`, formModel.value);
        } else {
            res = await Http.post(url, formModel.value);
        }

        if (res.status === 201 || res.status === 200) {
            message.success(isEditMode.value ? "Modification enregistrée." : "Ajout effectué.");
            showFormModal.value = false;
            await fetchData();
        } else {
            message.error("Une erreur est survenue.");
            loadingBar.error();
        }
    } catch (error) {
        message.error("Erreur de communication avec le serveur.");
        loadingBar.error();
    } finally {
        loading.value = false;
        loadingBar.finish();
    }
};

const renderSuffix = ({ option }: { option: TreeOption }) => {
    return h(NSpace, {}, {
        default: () => [
            h(NButton, {
                text: true, type: 'success', onClick: (e) => {
                    e.stopPropagation();
                    onAddChildClick(option);
                }
            }, { icon: () => h(AddOutline), default: () => "Ajouter un sous-élément" }),
            h(NButton, {
                text: true, type: 'info', onClick: (e) => {
                    e.stopPropagation();
                    onEditClick(option);
                }
            }, { icon: () => h(CreateOutline) }),
            h(NButton, {
                text: true, type: 'error', onClick: (e) => {
                    e.stopPropagation();
                    onDeleteClick(option);
                }
            }, { icon: () => h(TrashOutline) })
        ]
    });
};

watch(teachingUnitId, () => {
    constElementId.value = null;
    fetchConstElements();
});

watch(constElementId, () => {
    fetchData();
});

let debounceTimer: any = null;
watch(searchQuery, () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchData, 500);
});

onMounted(() => {
    fetchTeachingUnits();
});
</script>
