<template>
    <NForm ref="formRef" :model="courseInfo" :rules="formRules">
        <NGrid :cols="4" :x-gap="5">
            <!-- Date -->
            <NFormItemGi :span="2" label="Date:" path="date">
                <NDatePicker v-model:value="courseInfo['date']" />
            </NFormItemGi>
            <!-- Tranche horaire -->
            <NFormItemGi :span="2" label="Tranche horaire:" path="hour_slice_id">
                <NSelect filterable clearable v-model:value="courseInfo['hour_slice_id']" />
            </NFormItemGi>
            <!-- Enseignant -->
            <NFormItemGi :span="4" label="Enseignant:" path="teacher_id">
                <NSelect filterable clearable v-model:value="courseInfo['teacher_id']" />
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
import type { FormRules } from 'naive-ui';

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

const formRules: FormRules = {
    date: {
        type: 'number',
        required: true,
    },
    hour_slice_id: {
        type: 'string',
        required: true,
    },
    teacher_id: {
        type: 'string',
        required: true,
    },
    const_element_id: {
        type: 'string',
        required: true,
    },
    room_id: {
        type: 'string',
        required: true,
    },
};

const formRef = useTemplateRef('formRef');
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

function onNextClick() {
    // FIXME: Validate form input before submitting
    emits('click:submit', courseInfo.value);
}

onMounted(() => {
    loadCourseInfo();
});
</script>