<template>
    <NModal preset="dialog" :title="title" v-model:show="showModal" @update:show="onShowUpdate">
        <NForm :model="formValue" ref="formRef">
            <NFormItem path="date">
                <NDatePicker type="date" format="dd MMMM yyyy" v-model:value="formValue['date']"
                    :placeholder="Dates.format(new Date(), 'dd MMMM yyyy')" />
            </NFormItem>
            <NFormItem path="class_id">
                <NSelect placeholder="Aucune classe..." :options="Options.formatClasses(classes)"
                    v-model:value="formValue['class_id']">
                    <NEmpty description="Aucune donnée." />
                </NSelect>
            </NFormItem>
            <NFormItem path="teacher_id">
                <NSelect placeholder="Aucun enseignant..." :options="Options.formatTeachers(teachers)"
                    v-model:value="formValue['teacher_id']">
                    <NEmpty description="Aucune donnée." />
                </NSelect>
            </NFormItem>
            <NFormItem path="hour_part_id">
                <NSelect placeholder="Aucun horaire..." :options="Options.formatHourParts(hourParts)"
                    v-model:value="formValue['hour_part_id']">
                    <NEmpty description="Aucune donnée." />
                </NSelect>
            </NFormItem>
            <NFormItem path="const_element_id">
                <NSelect placeholder="Aucun élément constitutif..."
                    :options="Options.formatConstElements(constElements)" v-model:value="formValue['const_element_id']">
                    <NEmpty description="Aucune donnée." />
                </NSelect>
            </NFormItem>
        </NForm>
    </NModal>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';
import { Http } from '@/lib/http';
import { Options } from '@/lib/options';
import { fetchClasses } from '@/services/classes';
import { fetchConstElements } from '@/services/const_elements';
import { fetchHourParts } from '@/services/hour_parts';
import { fetchTeachers } from '@/services/teachers';
import { type Class } from '@/types/class';
import { type ConstElement } from '@/types/const_element';
import { type HourPart } from '@/types/hour_part';
import type { ProgressBlock } from '@/types/progress';
import { type Teacher } from '@/types/teacher';
import { type FormInst, useLoadingBar, useMessage } from 'naive-ui';

type Props = {
    show: boolean;
    isEditMode: boolean;
    progress: ProgressBlock | null;
};

type Emits = {
    (event: 'update:show', show: boolean): void;
    (event: 'submit', data: ProgressBlock): void;
};

const emits = defineEmits<Emits>();
const props = defineProps<Props>();

const message = useMessage();
const loadingBar = useLoadingBar();

const formRef = ref<FormInst | null>(null);
const formValue = ref<any>({});
const classes = ref<Class[]>([]);
const teachers = ref<Teacher[]>([]);
const hourParts = ref<HourPart[]>([]);
const constElements = ref<ConstElement[]>([]);

const title = computed(() => !props.isEditMode ? "Enregistrer un cours" : "Modifier un enregistrement de cours");
const showModal = ref<boolean>(props.show);

const onShowUpdate = (newShow: boolean) => emits('update:show', newShow);

onMounted(async () => {
    if (!props.isEditMode || !props.progress) {
        formValue.value = {};
        return;
    }

    formValue.value['date'] = Dates.getTimeStamp(props.progress['date']);
    formValue.value['class_id'] = props.progress['class_id'];
    formValue.value['teacher_id'] = props.progress['teacher_id'];
    formValue.value['hour_part_id'] = props.progress['hour_part_id'];
    formValue.value['const_element_id'] = props.progress['const_element_id'];
    formValue.value['fallback_context'] = props.progress['fallback_context'];

    classes.value = await fetchClasses(loadingBar, message);
    teachers.value = await fetchTeachers(loadingBar, message);
    hourParts.value = await fetchHourParts(loadingBar, message);
    constElements.value = await fetchConstElements(loadingBar, message);
})
</script>