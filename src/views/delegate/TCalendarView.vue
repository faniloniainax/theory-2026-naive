<template>
    <NSpace vertical justify="center" align="center">
        <!-- <NTimeline>
            <TCalendarItem title="Done" :beg :end />
            <TCalendarItem title="Ongoing" :beg="beg2" :end="end2" />
            <TCalendarItem title="NotDone" :beg="beg3" :end="end3" />
        </NTimeline> -->
        <TInConstruction />
    </NSpace>
</template>

<script setup lang="ts">
import TInConstruction from '../public/TInConstruction.vue';

const beg = 1725148800000;
const end = 1734220800000;

const beg2 = 1765148800000;
const end2 = 1774220800000;

const beg3 = 1865148800000;
const end3 = 1874220800000;
</script>