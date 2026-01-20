<script setup lang="ts">
import { Dates } from '@/lib/dates';

</script>

<template>
    <NCard bordered class="copyright-card">
        <NP :depth="3">
            &copy;
            ENI - {{ Dates.getCurrentYear() }}
        </NP>
    </NCard>
</template>

<style scoped>
.copyright-card {
    z-index: 99;
    width: fit-content;
    height: fit-content;
    position: fixed;
    left: 10px;
    bottom: 10px;
}
</style>