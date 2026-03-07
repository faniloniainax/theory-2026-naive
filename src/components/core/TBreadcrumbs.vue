<template>
    <NBreadcrumb>
        <NBreadcrumbItem v-for="crumb in breadcrumbs" :key="crumb.path" @click="onRouteClick(crumb.path)">
            <NIcon v-if="crumb.icon">
                <component :is="crumb.icon" />
            </NIcon>
            {{ crumb.label }}
        </NBreadcrumbItem>
    </NBreadcrumb>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
    return route.matched
        .filter(r => r.name)
        .map(r => ({
            label: r.name,
            path: r.path,
            icon: r.meta?.icon,
        }));
});

function onRouteClick(path: string) {
    router.push(path);
}
</script>