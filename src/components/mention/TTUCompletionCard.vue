<template>
    <NCard size="small" hoverable class="tu-card">
        <NButton text circle class="arrow-btn" @click.stop="onClick">
            <template #icon>
                <ChevronRight />
            </template>
        </NButton>

        <template #header>
            <NSpace align="center" justify="space-between">

                <div class="tu-title">{{ data.code }}</div>
                <div class="tu-subtitle">{{ data.name }}</div>


                <NSpace justify="center" align="center">
                    <NTag :type="statusType" size="large" round>
                        {{ Math.round(data.completion_percentage) }}%
                    </NTag>

                    <component :is="Tags.getProgressCount(data['total_courses_count'])" />
                </NSpace>
            </NSpace>
        </template>

        <NSpace vertical size="small">
            <n-progress type="line" :percentage="data.completion_percentage" :status="statusType" :height="8"
                :show-indicator="false" />

            <NSpace justify="space-between" class="hours-row">
                <div>
                    <span class="hours-strong">{{ data.current_hours_theoric }}</span>
                    <span class="hours-muted"> h effectuées</span>
                </div>
                <div class="hours-muted">
                    / {{ data.total_hours_theoric }} h
                </div>
            </NSpace>
        </NSpace>

        <template #footer>
            <NP :depth="3"><b>ECs:</b> {{ data['children_string'] }}</NP>
        </template>
    </NCard>
</template>

<script setup lang="ts">
import type { TUCompletion } from '@/types/tracking';
import { computed } from 'vue';
import ChevronRight from 'vicons/ionicons-v5/ChevronForward.vue';
import { Tags } from '@/lib/tags';

type Props = {
    data: TUCompletion;
};

type Emits = {
    (event: 'open', data: TUCompletion): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const onClick = () => {
    emit('open', props.data);
};

const statusType = computed(() => {
    const p = props.data.completion_percentage;
    if (p >= 100) return 'success';
    if (p >= 70) return 'info';
    if (p >= 40) return 'warning';
    return 'error';
});
</script>

<style scoped>
.tu-card {
    position: relative;
    padding-right: 36px;
    /* room for arrow */
}

.arrow-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.tu-card:hover .arrow-btn {
    opacity: 1;
    transform: translateY(-50%) translateX(2px);
}

.tu-title {
    font-weight: 600;
    font-size: 18px;
}

.tu-subtitle {
    font-size: 14px;
    opacity: 0.7;
}

.hours-row {
    font-size: 14px;
}

.hours-strong {
    font-weight: 600;
}

.hours-muted {
    opacity: 0.65;
}
</style>
