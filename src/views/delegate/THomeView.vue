<template>
    <NCard title="Fréquence des cours">
        <!-- TODO: Stop ts from loading -->
        <NHeatmap :data="frequencyData" :loading="true">
            <template #indicator-leading-text>
                moins
            </template>
            <template #indicator-trailing-text>
                plus
            </template>
        </NHeatmap>
    </NCard>

    <NCard title="Résumé des progrès">
        <NFlex justify="space-between">
            <NFlex justify="center" align="center">
                <NP :depth="3">Cours théoriques</NP>
                <NProgress type="circle" :percentage="theoricCoursesPercentage" :color="themeVars.successColor" />
            </NFlex>
            <NFlex justify="center" align="center">
                <NP :depth="3">Travaux dirigés</NP>
                <NProgress type="circle" :percentage="directedWorkPercentage" :color="themeVars.errorColor" />
            </NFlex>
            <NFlex justify="center" align="center">
                <NP :depth="3">Travaux pratiques</NP>
                <NProgress type="circle" :percentage="practicalWorkPercentage" :color="themeVars.warningColor" />
            </NFlex>
        </NFlex>
    </NCard>
</template>

<script setup lang="ts">
import { heatmapMockData, useThemeVars } from 'naive-ui';

const frequencyData = heatmapMockData(2026);
const themeVars = useThemeVars();

const theoricCoursesPercentage = computed(() => 67);
const directedWorkPercentage = computed(() => 41);
const practicalWorkPercentage = computed(() => 26);
</script>

<style scoped></style>