<template>
  <NConfigProvider :theme="theme">
    <NDialogProvider>
      <NMessageProvider>
        <NLoadingBarProvider>
          <TPublicLayout />
        </NLoadingBarProvider>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui';
import TPublicLayout from './layouts/TPublicLayout.vue';

const theme = ref(darkTheme);
</script>

<style scoped></style>
