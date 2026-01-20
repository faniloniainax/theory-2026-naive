<template>
    <teleport to="body">
        <NCard bordered class="copyright-card">
            <NP :depth="3">
                &copy; ENI – {{ Dates.getCurrentYear() }}
            </NP>
        </NCard>
    </teleport>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';

</script>

<style scoped>
.copyright-card {
    position: fixed;
    left: 10px;
    bottom: 10px;
    z-index: 3000;
    width: fit-content;
    height: fit-content;
    /* higher than NDrawer */
}
</style>