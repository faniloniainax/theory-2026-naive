<template>
    <NModal preset="dialog" title="Détails du cours" :show="visible" @update:show="onVisibleUpdate" closable
        close-on-esc>
        <NTabs v-model:value="tabValue">
            <NTabPane name="infos" tab="Informations">
                <template v-if="course">
                    <NDescriptions :columns="2" bordered>
                        <NDescriptionsItem label="Date">{{ course['date'] }}</NDescriptionsItem>
                        <NDescriptionsItem label="Tranche horaire">
                            {{ makeHourPartText(course['hour_part']) }}
                        </NDescriptionsItem>
                        <NDescriptionsItem label="Matière">
                            {{ makeConstElementText(course['const_element']) }}
                        </NDescriptionsItem>
                        <NDescriptionsItem label="Enseignant responsable">
                            {{ makeTeacherText(course['teacher']) }}
                        </NDescriptionsItem>
                    </NDescriptions>
                </template>
            </NTabPane>
            <NTabPane name="context" tab="Contexte">
                <template v-if="course" v-for="(t, i) in teachingTypes" :key="t['id']">
                    <TLogbookContextPreview v-show="tabValue === 'context' && currentTt === i" :title="t['name']"
                        :disabled-prev="i === 0" :disabled-next="i + 1 === teachingTypes.length" :editable="false"
                        :value="lookupContextValue(t['id'])" @click:next="currentTt++" @click:prev="currentTt--" />
                </template>
            </NTabPane>
        </NTabs>
    </NModal>
</template>

<script setup lang="ts">
import useTexts from '@/composables/core/useTexts';
import type { Course } from '@/types/course';
import type { TeachingType } from '@/types/teaching_type';

type Props = {
    course: Course | null;
    visible: boolean;
    teachingTypes: TeachingType[];
};

type Emits = {
    (event: 'update:visible', newVisible: boolean): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const currentTt = ref(0);
const tabValue = ref("infos");
const { makeHourPartText, makeConstElementText, makeTeacherText } = useTexts();

function lookupContextValue(ttId: string): string {
    // TODO: Load the contexts correctly from the backend.
    // Right now, the contexts are an empty array.
    if (!props.course || !props.course.contexts)
        return "";

    for (const ctx of props.course.contexts) {
        if (ctx['teaching_type_id'] === ttId)
            return ctx['description'];
    }

    return "";
}

function onVisibleUpdate(newVisible: boolean) {
    emits('update:visible', newVisible);
}
</script>