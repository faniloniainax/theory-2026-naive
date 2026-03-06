<template>
    <NPopover trigger="click" placement="right">
        <template #trigger>
            <NButton circle>
                <NIcon size="large">
                    <PersonCircleOutline />
                </NIcon>
            </NButton>
        </template>

        <template #default>
            <NFlex vertical>
                <!-- Avatag + Username -->
                <NSpace align="center" justify="center">
                    <NAvatar size="large">{{ initials }}</NAvatar>
                    <NP :depth="3">{{ name }}</NP>
                </NSpace>

                <!-- Theme toggle -->
                <NSwitch :value="isDarkTheme" @update-value="onThemeToggle">
                    <template #checked-icon>
                        <NIcon>
                            <MoonOutline />
                        </NIcon>
                    </template>
                    <template #unchecked-icon>
                        <NIcon>
                            <SunnyOutline />
                        </NIcon>
                    </template>
                </NSwitch>
            </NFlex>
        </template>
    </NPopover>
</template>

<script setup lang="ts">
import useAuth from '@/composables/core/useAuth';
import useStorage from '@/composables/core/useStorage';
import MoonOutline from 'vicons/ionicons-v5/MoonOutline.vue';
import PersonCircleOutline from 'vicons/ionicons-v5/PersonCircleOutline.vue';
import SunnyOutline from 'vicons/ionicons-v5/SunnyOutline.vue';

type Emits = {
    (event: 'toggle:theme', isDark: boolean): void;
};

const emits = defineEmits<Emits>();

const { makeInitialsAndName } = useAuth();

const [initials, name] = makeInitialsAndName();
const isDarkTheme = ref<boolean>();

function getIsDark() {
    const { loadRaw, storeRaw } = useStorage();
    let theme = loadRaw("theme");

    if (!theme) {
        theme = "light";
        storeRaw("theme", theme);
    }

    return theme === 'dark';
}

function onThemeToggle(isDark: boolean) {
    const { storeRaw } = useStorage();

    isDarkTheme.value = isDark;
    if (isDark)
        storeRaw("theme", "dark");
    else
        storeRaw("theme", "light");

    emits("toggle:theme", isDark);
}

onMounted(() => {
    isDarkTheme.value = getIsDark();
});
</script>