<template>
    <NCard>
        <template #header>
            <NFlex justify="center" align="center">
                Fréquence des enseignements
            </NFlex>
        </template>
        <NScrollbar x-scrollable>
            <!-- TODO: Stop ts from loading -->
            <NHeatmap :data="frequencyData" loading>
                <template #indicator-leading-text>
                    moins
                </template>
                <template #indicator-trailing-text>
                    plus
                </template>
            </NHeatmap>
        </NScrollbar>
    </NCard>

    <NCard>
        <template #header>
            <NFlex justify="center" align="center">
                Résumé des progrès
            </NFlex>
        </template>

        <NTabs justify-content="center">
            <NTabPane name="theoric-progress" tab="Théoriques">
                <NProgress type="line" :percentage="theoricCoursesPercentage">
                    ? %
                </NProgress>
            </NTabPane>
            <NTabPane name="directed-progress" tab="Dirigés">
                <NProgress type="line" processing :percentage="directedWorkPercentage">
                    ? %
                </NProgress>
            </NTabPane>
            <NTabPane name="practical-progress" tab="Pratiques">
                <NProgress type="line" processing :percentage="practicalWorkPercentage">
                    ? %
                </NProgress>
            </NTabPane>
        </NTabs>
    </NCard>
</template>

<script setup lang="ts">
import { heatmapMockData, useThemeVars } from 'naive-ui';

const frequencyData = heatmapMockData(2026);
const themeVars = useThemeVars();

const theoricCoursesPercentage = computed(() => /* 67 */ 0);
const directedWorkPercentage = computed(() => /* 41 */ 0);
const practicalWorkPercentage = computed(() => /* 26 */ 0);
</script>

<style scoped></style>