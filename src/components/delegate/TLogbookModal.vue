<template>
    <NModal preset="dialog" :title="getFormTitle" :show="visible" @update:show="onShowUpdate" closable close-on-esc>
        <NTabs v-model:value="tabValue" justify-content="center" @before-leave="() => false">
            <NTabPane name="infos" tab="Informations">
                <TLogbookInfoTab v-model:info="course.info" @click:cancel="onInfoFormCancel"
                    @click:submit="onInfoFormSubmit" />
            </NTabPane>
            <NTabPane name="context" tab="Contexte">
                <TLogbookContextTab @click:prev="onContextFormPrev" />
            </NTabPane>
        </NTabs>
    </NModal>
</template>

<script setup lang="ts">
import type { CourseInfo } from '@/types/course';

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
const course = ref({
    info: {
        date: Date.now(),
        room_id: null,
        teacher_id: null,
        hour_slice_id: null,
        const_element_id: null,
    } as CourseInfo,
});

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

function onContextFormPrev() {
    tabValue.value = "infos";
}
</script>