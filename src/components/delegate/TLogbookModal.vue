<template>
    <NModal preset="dialog" :title="getFormTitle" :show="visible" @update:show="onShowUpdate" closable close-on-esc>
        <NTabs v-model:value="tabValue" justify-content="center" @before-leave="() => false">
            <NTabPane name="infos" tab="Informations">
                <TLogbookInfoTab :rooms :teachers :hour-parts :const-elements v-model:info="course.info"
                    @click:cancel="onInfoFormCancel" @click:submit="onInfoFormSubmit" />
            </NTabPane>
            <NTabPane name="context" tab="Contexte">
                <TLogbookContextTab :teaching-types v-model:course-contexts="course.contexts"
                    @click:prev="onContextFormPrev" @click:submit="onContextFormSubmit" />
            </NTabPane>
        </NTabs>
    </NModal>
</template>

<script setup lang="ts">
import useAuth from '@/composables/core/useAuth';
import useConstElements from '@/composables/services/useConstElements';
import useHourParts from '@/composables/services/useHourParts';
import useRooms from '@/composables/services/useRooms';
import useTeachers from '@/composables/services/useTeachers';
import useTeachingTypes from '@/composables/services/useTeachingTypes';
import type { ConstElement } from '@/types/const_element';
import type { CourseInfo } from '@/types/course';
import type { HourPart } from '@/types/hour_part';
import type { Room } from '@/types/room';
import type { Teacher } from '@/types/teacher';
import type { TeachingType } from '@/types/teaching_type';

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
        date: (new Date()).toISOString(),
        room_id: null,
        teacher_id: null,
        hour_slice_id: null,
        const_element_id: null,
    } as CourseInfo,
    contexts: [],
});

const [{ getRooms }, { getTeachers }, { getHourParts }, { getConstElements }, { getTeachingTypes }] = [
    useRooms(),
    useTeachers(),
    useHourParts(),
    useConstElements(),
    useTeachingTypes(),
];
const [rooms, teachers, hourParts, teachingTypes, constElements] = [
    ref<Room[]>([]),
    ref<Teacher[]>([]),
    ref<HourPart[]>([]),
    ref<TeachingType[]>([]),
    ref<ConstElement[]>([]),
];

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

function onContextFormSubmit() {
    console.log(course.value);
}

onMounted(async () => {
    const class_ = useAuth().getClass();

    rooms.value = await getRooms();
    teachers.value = await getTeachers();
    hourParts.value = await getHourParts();
    teachingTypes.value = await getTeachingTypes();

    if (class_)
        constElements.value = await getConstElements(class_["stage_id"], class_["branch_id"]);
    else
        constElements.value = [];
});
</script>