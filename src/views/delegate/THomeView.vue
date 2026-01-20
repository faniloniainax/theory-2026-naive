<template>
    <NFlex vertical>
        <NCard title="Fréquence des cours">
            <NHeatmap :data="frequencyData" />
        </NCard>

        <NCard title="Résumé des progrès">
            <NFlex justify="space-between">
                <NFlex justify="center" align="center">
                    <NP :depth="3">Cours théoriques</NP>
                    <NProgress type="circle" :percentage="67" :color="themeVars.successColor" />
                </NFlex>
                <NFlex justify="center" align="center">
                    <NP :depth="3">Travaux dirigés</NP>
                    <NProgress type="circle" :percentage="41" :color="themeVars.errorColor" />
                </NFlex>
                <NFlex justify="center" align="center">
                    <NP :depth="3">Travaux pratiques</NP>
                    <NProgress type="circle" :percentage="26" :color="themeVars.warningColor" />
                </NFlex>
            </NFlex>
        </NCard>
    </NFlex>
</template>

<script setup lang="ts">
import { heatmapMockData, useThemeVars } from 'naive-ui';

const frequencyData = heatmapMockData(2026);
const themeVars = useThemeVars();
</script>

<style scoped></style>