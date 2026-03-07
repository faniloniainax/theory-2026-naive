<template>
    <NTimelineItem :title :type="timelineType">
        <template #footer>
            <NTime :format="DATE_FORMAT" :time="beg" />
            ->
            <NTime :format="DATE_FORMAT" :time="end" />
        </template>
    </NTimelineItem>
</template>

<script setup lang="ts">
import useDates from '@/composables/core/useDates';

type Props = {
    title: string;
    beg: number | Date;
    end: number | Date;
};

const DATE_FORMAT = "dd MMMM yyyy";

const props = defineProps<Props>();
const timelineType = computed(() => {
    const done: 'success' = 'success';
    const ongoing: 'warning' = 'warning';
    const notDone: 'error' = 'error';

    const { formatToTS } = useDates();

    const begTs = typeof (props.beg) === 'number' ? props.beg : formatToTS(props.beg.toISOString());
    const endTs = typeof (props.end) === 'number' ? props.end : formatToTS(props.end.toISOString());
    const currentDate = formatToTS(new Date().toISOString());

    if (currentDate >= begTs && currentDate <= endTs)
        return ongoing;
    if (currentDate < begTs)
        return notDone;
    return done;
});
</script>