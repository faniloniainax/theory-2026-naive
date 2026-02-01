<template>
    <NFloatButton position="absolute" :bottom="10" :left="10" shape="square" :width="100">
        <NPopover>
            <template #trigger>
                <NP :depth="3">
                    &copy; ENI - {{ Dates.getCurrentYear() }}
                </NP>
            </template>
            <template #default>
                Copyright Ecole Nationale d'Informatique {{ Dates.getCurrentYear() }} - Tous droits réservés.
            </template>
        </NPopover>
    </NFloatButton>
</template>

<script setup lang="ts">
import { Dates } from '@/lib/dates';

</script>