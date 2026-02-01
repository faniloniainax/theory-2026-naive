<template>
  <NConfigProvider :theme="theme">
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
