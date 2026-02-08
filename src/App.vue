<template>
  <NConfigProvider :theme="appropriateTheme" :theme-overrides="themeOverrides" :locale="frFR" :date-locale="dateFrFR">
    <NDialogProvider>
      <NMessageProvider>
        <NLoadingBarProvider>
          <component :is="appropriateLayout" />
        </NLoadingBarProvider>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui';
import TPublicLayout from './layouts/TPublicLayout.vue';
import { useRoute } from 'vue-router';
import { frFR, dateFrFR } from 'naive-ui';
import { useOsTheme } from 'naive-ui';
import useStorage from './composables/core/useStorage';

const route = useRoute();

const osTheme = useOsTheme();

const appropriateTheme = computed(() => {
  const { loadRaw, storeRaw } = useStorage();
  let storedTheme = loadRaw("theme");

  if (!storedTheme) {
    if (osTheme.value === 'dark')
      storedTheme = "dark";
    else
      storedTheme = "light";

    storeRaw("theme", storedTheme);
  }

  if (storedTheme === 'dark')
    return darkTheme;
  return lightTheme;
});

const themeOverrides = computed(() => ({
  common:
    appropriateTheme.value === darkTheme
      ? {
        baseColor: '#18181c',
        bodyColor: '#101014',
        textColor1: '#e6e6eb',
        textColor2: '#b3b3b8',
      }
      : {
        baseColor: '#f0f2f5',
        bodyColor: '#f7f7f7',
        textColor1: '#1a1a1a',
        textColor2: '#444',
      }
}));

const appropriateLayout = computed(() => {
  if (route.meta?.layout) {
    return route.meta?.layout;
  }

  return TPublicLayout;
});
</script>

<style scoped></style>
