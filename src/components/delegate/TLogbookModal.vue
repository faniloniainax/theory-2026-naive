<template>
    <NModal preset="dialog" :title="getFormTitle" :show="visible" @update:show="onShowUpdate" closable close-on-esc>
        <NTabs v-model:value="tabValue" justify-content="center" @before-leave="() => false">
            <NTabPane name="infos" tab="Informations">
                <TLogbookInfoTab :rooms :teachers :hour-parts :const-elements v-model:info="currentCourse.info"
                    @click:cancel="onInfoFormCancel" @click:submit="onInfoFormSubmit" />
            </NTabPane>
            <NTabPane name="context" tab="Contexte">
                <TLogbookContextTab :teaching-types v-model:course-contexts="currentCourse.contexts"
                    @click:prev="onContextFormPrev" @click:submit="onContextFormSubmit" />
            </NTabPane>
        </NTabs>
    </NModal>
</template>

<script setup lang="ts">
import useAuth from '@/composables/core/useAuth';
import useConstElements from '@/composables/services/useConstElements';
import useCourses from '@/composables/services/useCourses';
import useHourParts from '@/composables/services/useHourParts';
import useRooms from '@/composables/services/useRooms';
import useTeachers from '@/composables/services/useTeachers';
import useTeachingTypes from '@/composables/services/useTeachingTypes';
import type { ConstElement } from '@/types/const_element';
import type { Course, CourseContext, CourseInfo } from '@/types/course';
import type { HourPart } from '@/types/hour_part';
import type { Room } from '@/types/room';
import type { Teacher } from '@/types/teacher';
import type { TeachingType } from '@/types/teaching_type';
import { useMessage } from 'naive-ui';

type Props = {
    visible: boolean;
    course?: Course | null;
    isEditMode: boolean;
};

type Emits = {
    (event: 'update:visible', newVisible: boolean): void;
    (event: 'click:submit'): void;
};

const props = withDefaults(defineProps<Props>(), {
    course: null,
});
const emits = defineEmits<Emits>();

const message = useMessage();

const tabValue = ref("infos");
const currentCourse = ref(getBaseCourse());

const [{ getRooms }, { registerCourse, makeContextArray }, { getTeachers }, { getHourParts }, { getConstElements }, { getTeachingTypes }] = [
    useRooms(),
    useCourses(),
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

function getBaseCourse() {
    return ({
        info: {
            id: null,
            date: (new Date()).toISOString(),
            room_id: null,
            teacher_id: null,
            hour_part_id: null,
            const_element_id: null,
        } as CourseInfo,
        contexts: [] as CourseContext[],
    });
}

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

async function onContextFormSubmit() {
    const class_ = useAuth().getClass();

    if (!class_)
        return;

    const ok = await registerCourse(class_['id'], currentCourse.value.info, currentCourse.value.contexts, props.isEditMode);
    if (!ok) {
        message.error("Impossible d'enregistrer cette séance.");
        return;
    }

    message.success("Séance enregistrée avec succès.");

    tabValue.value = "infos";
    currentCourse.value = getBaseCourse();

    emits('click:submit');
}

watch(() => props.course, (newCourse) => {
    if (!newCourse) {
        currentCourse.value = getBaseCourse();
        return;
    }

    currentCourse.value = {
        info: {
            id: newCourse['id'],
            date: newCourse['date'],
            room_id: newCourse['room_id'],
            teacher_id: newCourse['teacher_id'],
            hour_part_id: newCourse['hour_part_id'],
            const_element_id: newCourse['const_element_id'],
        },
        contexts: newCourse['contexts']!,
    };
}, { deep: true });

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