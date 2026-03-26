<template>
    <NForm>
        <template v-for="(t, i) in teachingTypes" :key="t['id']">
            <TLogbookContextPreview v-show="currentTt === i" :title="t['name']" :disabled-prev="i === 0"
                :disabled-next="i + 1 === teachingTypes.length" @click:prev="currentTt--" @click:next="currentTt++"
                v-model:value="courseContexts[t['id']]" />
        </template>
    </NForm>

    <NSpace justify="end">
        <NButton type="error" ghost @click="onPrevClick">Précédent</NButton>
        <NButton type="success" ghost @click="onSubmitClick">Envoyer</NButton>
    </NSpace>
</template>

<script setup lang="ts">
import useCourses from '@/composables/services/useCourses';
import type { Course, CourseContext } from '@/types/course';
import type { TeachingType } from '@/types/teaching_type';

type Props = {
    courseContexts: CourseContext[];
    teachingTypes: TeachingType[];
};

type Emits = {
    (event: 'click:prev'): void;
    (event: 'click:submit', ctx: Record<string, string>): void;
    (event: 'update:course-contexts', contexts: CourseContext[]): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const currentTt = ref(0);
const courseContexts = ref<Record<string, string>>({});
const { makeContextRecord, makeContextArray } = useCourses();

function loadCourseContexts() {
    courseContexts.value = makeContextRecord(props.courseContexts);
    props.teachingTypes.forEach(t => {
        const desc = courseContexts.value[t['id']];

        if (!desc)
            courseContexts.value[t['id']] = "";
    });
}

function onPrevClick() {
    emits('click:prev');
}

function onSubmitClick() {
    emits('click:submit', courseContexts.value);
}

watch(() => courseContexts.value, (newContext) => {
    emits('update:course-contexts', makeContextArray(newContext));
}, { deep: true });

onMounted(() => {
    loadCourseContexts();
})
</script>