<template>
    <NSpace justify="center" align="center">
        <!-- Show more button -->
        <NButton size="small" ghost @click="onShowMoreClick">
            <template #icon>
                <NIcon size="large">
                    <EyeOutline />
                </NIcon>
            </template>
        </NButton>
        <!-- Edit button -->
        <NButton size="small" type="info" ghost @click="onEditClick">
            <template #icon>
                <NIcon size="large">
                    <PencilOutline />
                </NIcon>
            </template>
        </NButton>
        <!-- Delete button -->
        <NButton size="small" type="error" ghost @click="onDeleteClick">
            <template #icon>
                <NIcon size="large">
                    <TrashBinOutline />
                </NIcon>
            </template>
        </NButton>
    </NSpace>
</template>

<script setup lang="ts">
import EyeOutline from 'vicons/ionicons-v5/EyeOutline.vue';
import PencilOutline from 'vicons/ionicons-v5/PencilOutline.vue';
import TrashBinOutline from 'vicons/ionicons-v5/TrashBinOutline.vue';

type Emits = {
    (event: 'click:show-more'): void;
    (event: 'click:edit'): void;
    (event: 'click:delete'): void;
};

const emits = defineEmits<Emits>();

function onShowMoreClick() {
    emits('click:show-more');
}

function onEditClick() {
    emits('click:edit');
}

function onDeleteClick() {
    emits('click:delete');
}
</script>