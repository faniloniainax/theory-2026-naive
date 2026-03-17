<template>
    <NForm ref="formRef" :model="courseInfo" :rules="formRules">
        <NGrid :cols="4" :x-gap="5">
            <!-- Date -->
            <NFormItemGi :span="2" label="Date:" path="date">
                <TISODatePicker v-model:value="courseInfo['date']" />
            </NFormItemGi>
            <!-- Tranche horaire -->
            <NFormItemGi :span="2" label="Tranche horaire:" path="hour_slice_id">
                <NSelect filterable clearable v-model:value="courseInfo['hour_part_id']"
                    :options="makeHourPartOptions(hourParts)" />
            </NFormItemGi>
            <!-- Enseignant -->
            <NFormItemGi :span="4" label="Enseignant:" path="teacher_id">
                <NSelect filterable clearable v-model:value="courseInfo['teacher_id']"
                    :options="makeTeacherOptions(teachers)" />
            </NFormItemGi>
            <!-- Elément constitutif -->
            <NFormItemGi :span="2" label="Matière:" path="const_element_id">
                <NSelect filterable clearable v-model:value="courseInfo['const_element_id']"
                    :options="makeConstElementOptions(constElements)" />
            </NFormItemGi>
            <!-- Salle -->
            <NFormItemGi :span="2" label="Salle:" path="room_id">
                <NSelect filterable clearable v-model:value="courseInfo['room_id']" :options="makeRoomOptions(rooms)" />
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
import type { ConstElement } from '@/types/const_element';
import type { CourseInfo } from '@/types/course';
import type { HourPart } from '@/types/hour_part';
import type { Room } from '@/types/room';
import type { Teacher } from '@/types/teacher';
import { useMessage, type FormRules } from 'naive-ui';

type Props = {
    info: CourseInfo | null;
    rooms: Room[];
    teachers: Teacher[];
    hourParts: HourPart[];
    constElements: ConstElement[];
};

type Emits = {
    (event: 'click:cancel'): void;
    (event: 'update:info', c: CourseInfo): void;
    (event: 'click:submit', c: CourseInfo): void;
};

const props = withDefaults(defineProps<Props>(), {
    info: null,
});
const emits = defineEmits<Emits>();
const { makeHourPartOptions, makeTeacherOptions, makeConstElementOptions, makeRoomOptions } = useSelectOptions();

const formRules: FormRules = {
    date: {
        type: 'string',
        required: true,
    },
    hour_part_id: {
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

    courseInfo.value['date'] = new Date().toISOString();
    courseInfo.value['hour_part_id'] = null;
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

watch(() => courseInfo.value, (newCourseInfo) => {
    emits('update:info', newCourseInfo);
}, { deep: true });

onMounted(async () => {
    loadCourseInfo();
});
</script>