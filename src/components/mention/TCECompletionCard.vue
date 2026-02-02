<template>
    <NCard size="small" hoverable class="ce-card">
        <template #header>
            <NSpace align="center" justify="space-between">
                <div>
                    <div class="ce-title">{{ data.code }}</div>
                    <div class="ce-subtitle">{{ data.name }}</div>
                    <div class="ce-teacher">
                        {{ teacherFullName }}
                    </div>
                </div>


                <NSpace justify="center" align="center">
                    <NTag :type="statusType" size="large" round>
                        {{ Math.round(data.completion_percentage) }}%
                    </NTag>

                    <component :is="Tags.getProgressCount(data.total_courses_count)" />
                </NSpace>
            </NSpace>
        </template>

        <template #header-extra>

        </template>

        <NSpace style="width: 100%;" vertical size="small">
            <NProgress type="line" :percentage="data.completion_percentage" :status="statusType" :height="8"
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
    </NCard>
</template>

<script setup lang="ts">
import type { CECompletion } from '@/types/tracking';
import { computed } from 'vue';
import { Tags } from '@/lib/tags';
import { Texts } from '@/lib/texts';

type Props = {
    data: CECompletion;
};

const props = defineProps<Props>();

const statusType = computed(() => {
    const p = props.data.completion_percentage;
    if (p >= 100) return 'success';
    if (p >= 70) return 'info';
    if (p >= 40) return 'warning';
    return 'error';
});

const teacherFullName = computed(() => {
    return Texts.formatTeacher(props.data['teacher'])
});
</script>

<style scoped>
.ce-card {
    position: relative;
    padding-right: 36px;
}

.arrow-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.ce-card:hover .arrow-btn {
    opacity: 1;
    transform: translateY(-50%) translateX(2px);
}

.ce-title {
    font-weight: 600;
    font-size: 17px;
}

.ce-subtitle {
    font-size: 14px;
    opacity: 0.7;
}

.ce-teacher {
    font-size: 13px;
    opacity: 0.85;
    margin-top: 2px;
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
