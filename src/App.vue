<template>
  <NConfigProvider :theme="theme" :locale="frFR" :date-locale="dateFrFR">
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
import { darkTheme } from 'naive-ui';
import TPublicLayout from './layouts/TPublicLayout.vue';
import { useRoute } from 'vue-router';
import { frFR, dateFrFR } from 'naive-ui';

const theme = ref(darkTheme);
const route = useRoute();

const appropriateLayout = computed(() => {
  if (route.meta?.layout) {
    return route.meta?.layout;
  }

  return TPublicLayout;
});
</script>

<style scoped></style>
