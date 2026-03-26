<template>
    <NSpace vertical justify="center" align="center">
        <template v-if="calendarDates.length === 0">
            <NEmpty description="Aucun calendrier disponible" />
        </template>
        <template v-else>
            <NTimeline v-for="c in calendarDates">
                <TCalendarItem :title="`Cours théoriques (${c.name})`" :beg="c.courses_beg" :end="c.courses_end" />
                <TCalendarItem :title="`Session normale (${c.name})`" :beg="c.exams_beg" :end="c.exams_end" />
                <TCalendarItem :title="`Session de rattrapage (${c.name})`" :beg="c.retrials_beg"
                    :end="c.retrials_end" />
            </NTimeline>
        </template>
    </NSpace>
</template>

<script setup lang="ts">
import useLoading from '@/composables/core/useLoading';
import TInConstruction from '../public/TInConstruction.vue';
import useSemesters from '@/composables/services/useSemesters';
import type { CalendarDates } from '@/types/semester';
import useAuth from '@/composables/core/useAuth';

const calendarDates = ref<CalendarDates[]>([]);
const semesters = useSemesters();

async function getData() {
    const class_ = useAuth().getClass();

    if (!class_) {
        calendarDates.value = [];
        return;
    }

    await useLoading().runAsyncLoading(async () => {
        const r = await semesters.getCalendarDates(class_['id']);

        calendarDates.value = r;
        return true;
    });
}

onMounted(async () => {
    await getData();
});
</script>