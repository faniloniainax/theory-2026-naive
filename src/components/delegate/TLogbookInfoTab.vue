<template>
    <NForm ref="formRef" :model="courseInfo" :rules="formRules">
        <NGrid :cols="4" :x-gap="5">
            <!-- Date -->
            <NFormItemGi :span="2" label="Date:" path="date">
                <NDatePicker v-model:value="courseInfo['date']" />
            </NFormItemGi>
            <!-- Tranche horaire -->
            <NFormItemGi :span="2" label="Tranche horaire:" path="hour_slice_id">
                <NSelect filterable clearable v-model:value="courseInfo['hour_slice_id']"
                    :options="makeHourPartOptions(hourParts)" />
            </NFormItemGi>
            <!-- Enseignant -->
            <NFormItemGi :span="4" label="Enseignant:" path="teacher_id">
                <NSelect filterable clearable v-model:value="courseInfo['teacher_id']"
                    :options="makeTeacherOptions(teachers)" />
            </NFormItemGi>
            <!-- Elément constitutif -->
            <NFormItemGi :span="2" label="Matière:" path="const_element_id">
                <NSelect filterable clearable v-model:value="courseInfo['const_element_id']" />
            </NFormItemGi>
            <!-- Salle -->
            <NFormItemGi :span="2" label="Salle:" path="room_id">
                <NSelect filterable clearable v-model:value="courseInfo['room_id']" />
            </NFormItemGi>
        </NGrid>
        <NSpace justify="end">
            <NButton type="error" ghost @click="onCancelClick">Annuler</NButton>
            <NButton type="success" ghost @click="onNextClick">Suivant</NButton>
        </NSpace>
    </NForm>
</template>

<script setup lang="ts">
import useSelectOptions from '@/composables/core/useSelectOptions';
import useHourParts from '@/composables/services/useHourParts';
import useTeachers from '@/composables/services/useTeachers';
import type { HourPart } from '@/types/hour_part';
import type { Teacher } from '@/types/teacher';
import { useMessage, type FormRules } from 'naive-ui';

// TODO: Isolate
type CourseInfo = {
    date: number;
    hour_slice_id: string | null;
    teacher_id: string | null;
    const_element_id: string | null;
    room_id: string | null;
};

type Props = {
    info?: CourseInfo | null;
};

type Emits = {
    (event: 'click:cancel'): void;
    (event: 'click:submit', c: CourseInfo): void;
};

const props = withDefaults(defineProps<Props>(), {
    info: null,
});
const emits = defineEmits<Emits>();

const [{ getHourParts }, { getTeachers }] = [useHourParts(), useTeachers()];
const { makeHourPartOptions, makeTeacherOptions } = useSelectOptions();
const [hourParts, teachers] = [
    ref<HourPart[]>([]),
    ref<Teacher[]>([]),
];

const formRules: FormRules = {
    date: {
        type: 'number',
        required: true,
    },
    hour_slice_id: {
        type: 'string',
        required: true,
        message: "La tranche horaire est requise.",
    },
    teacher_id: {
        type: 'string',
        required: true,
        message: "L'enseignant est requis.",
    },
    const_element_id: {
        type: 'string',
        required: true,
        message: "La matière est requise.",
    },
    room_id: {
        type: 'string',
        required: true,
        message: "La salle est requise.",
    },
};

const formRef = useTemplateRef('formRef');

const message = useMessage();
const courseInfo = ref<CourseInfo>({} as CourseInfo);

function loadCourseInfo() {
    if (props.info) {
        courseInfo.value = props.info;
        return;
    }

    courseInfo.value['date'] = new Date().getTime();
    courseInfo.value['hour_slice_id'] = null;
    courseInfo.value['teacher_id'] = null;
    courseInfo.value['const_element_id'] = null;
    courseInfo.value['room_id'] = null;
}

function onCancelClick() {
    emits('click:cancel');
}

async function onNextClick() {
    try {
        await formRef.value?.validate();
        emits('click:submit', courseInfo.value);
    } catch (e) {
        message.error("Le formulaire est invalide.");
    }
}

onMounted(async () => {
    loadCourseInfo();

    hourParts.value = await getHourParts();
    teachers.value = await getTeachers();
});
</script>