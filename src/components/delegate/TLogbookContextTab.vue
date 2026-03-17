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
import type { TeachingType } from '@/types/teaching_type';

type Props = {
    courseContext?: Record<string, string>;
    teachingTypes: TeachingType[];
};

type Emits = {
    (event: 'click:prev'): void;
    (event: 'click:submit', ctx: Record<string, string>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const currentTt = ref(0);
const courseContexts = ref<Record<string, string>>({});

function loadCourseContexts() {
    if (props.courseContext) {
        courseContexts.value = props.courseContext;
        return;
    }

    props.teachingTypes.forEach(t => {
        courseContexts.value[t.id] = "";
    });
}

function onPrevClick() {
    emits('click:prev');
}

function onSubmitClick() {
    emits('click:submit', courseContexts.value);
}

onMounted(() => {
    loadCourseContexts();
})
</script>