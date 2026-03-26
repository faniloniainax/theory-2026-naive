<template>
    <NTimelineItem :title :type="timelineType">
        <template #icon>
            <NIcon>
                <CheckmarkCircleOutline v-if="getStatus() === 'done'" />
                <SyncCircleOutline v-else-if="getStatus() === 'ongoing'" />
                <CloseCircleOutline v-else />
            </NIcon>
        </template>
        <template #footer>
            <NTime :format="DATE_FORMAT" :time="beg" />
            ->
            <NTime :format="DATE_FORMAT" :time="end" />
        </template>
    </NTimelineItem>
</template>

<script setup lang="ts">
import SyncCircleOutline from 'vicons/ionicons-v5/SyncCircleOutline.vue';
import CloseCircleOutline from 'vicons/ionicons-v5/CloseCircleOutline.vue';
import CheckmarkCircleOutline from 'vicons/ionicons-v5/CheckmarkCircleOutline.vue';
import useDates from '@/composables/core/useDates';

type Props = {
    title: string;
    beg: number | Date;
    end: number | Date;
};

type Status = 'done' | 'ongoing' | 'not-done';

const DATE_FORMAT = "dd MMMM yyyy";

const props = defineProps<Props>();
const timelineType = computed(() => {
    switch (getStatus()) {
        case 'done':
            return 'success';
        case 'ongoing':
            return 'info';
        case 'not-done':
            return 'error';
    }
});

function getStatus(): Status {
    const dates = useDates();
    const begTs = typeof (props.beg) === 'number' ? props.beg : dates.formatToTS(props.beg.toISOString());
    const endTs = typeof (props.end) === 'number' ? props.end : dates.formatToTS(props.end.toISOString());
    const currentDate = dates.formatToTS(new Date().toISOString());

    if (currentDate >= begTs && currentDate <= endTs)
        return 'ongoing';
    if (currentDate < begTs)
        return 'not-done';
    return 'done';
}
</script>