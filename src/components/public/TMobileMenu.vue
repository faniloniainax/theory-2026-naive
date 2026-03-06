<template>
    <NPopover trigger="click" placement="left">
        <template #trigger>
            <NButton circle>
                <template #icon>
                    <NIcon>
                        <MenuOutline />
                    </NIcon>
                </template>
            </NButton>
        </template>

        <template #default>
            <NMenu :options="options" :value="selectedOption" @update:value="onOptionClick" />
        </template>
    </NPopover>
</template>

<script setup lang="ts">
import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import MenuOutline from 'vicons/ionicons-v5/MenuOutline.vue';
import { useRoute, useRouter } from 'vue-router';


type Props = {
    options: MenuMixedOption[] | undefined;
};

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();
const selectedOption = computed(() => route.path);

function onOptionClick(key: string) {
    router.push(key);
}
</script>