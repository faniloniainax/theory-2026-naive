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
};

type Emits = {
    (event: 'click:prev'): void;
    (event: 'click:submit', ctx: Record<string, string>): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const [teachingTypes, currentTt] = [[
    {
        id: 'bbb3ac68-0b15-4d5f-a913-2be8c22d980f',
        name: 'Théorique',
        is_theoric: true,
    },
    {
        id: '76740d4c-01c3-47ce-8ffb-dfd3f1c5e7ec',
        name: 'Dirigé',
        is_theoric: false,
    },
    {
        id: '28db5903-3f1f-4dee-a6c4-292e4870a976',
        name: 'Pratique',
        is_theoric: false,
    }
] as TeachingType[], ref(0)];
const courseContexts = ref<Record<string, string>>({});

function loadCourseContexts() {
    if (props.courseContext) {
        courseContexts.value = props.courseContext;
        return;
    }

    console.log(teachingTypes);
    teachingTypes.forEach(t => {
        courseContexts.value[t.id] = "";
    });

    console.log(courseContexts.value);
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