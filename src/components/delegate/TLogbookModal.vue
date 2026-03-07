<template>
    <NModal preset="dialog" :title="getFormTitle" :show="visible" @update:show="onShowUpdate" closable close-on-esc>
        <NTabs v-model:value="tabValue" justify-content="center" @before-leave="() => false">
            <NTabPane name="infos" tab="Informations">
                <TLogbookInfoTab @click:cancel="onInfoFormCancel" @click:submit="onInfoFormSubmit" />
            </NTabPane>
            <NTabPane name="context" tab="Contexte">
                <TLogbookContextTab />
            </NTabPane>
        </NTabs>
    </NModal>
</template>

<script setup lang="ts">
// TODO: Isolate
type CourseInfo = {
    date: number;
    hour_slice_id: string | null;
    teacher_id: string | null;
    const_element_id: string | null;
    room_id: string | null;
};

type Props = {
    visible: boolean;
    isEditMode: boolean;
};

type Emits = {
    (event: 'update:visible', newVisible: boolean): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const tabValue = ref("infos");

function getFormTitle() {
    return !props.isEditMode ?
        "Enregistrer une séance"
        : "Modifier une séance";
}

function onShowUpdate(newVisible: boolean) {
    emits('update:visible', newVisible);
    tabValue.value = "infos";
}

function onInfoFormCancel() {
    onShowUpdate(false);
}

function onInfoFormSubmit(c: CourseInfo) {
    tabValue.value = "context";
}
</script>