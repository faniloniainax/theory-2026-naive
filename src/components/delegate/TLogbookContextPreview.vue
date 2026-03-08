<template>
    <NSpace vertical>
        <!-- Context switching -->
        <NSpace justify="center" align="center">
            <NButton circle :disabled="disabledPrev" @click="onPrevClick">
                <template #icon>
                    <NIcon>
                        <ArrowBackCircleOutline />
                    </NIcon>
                </template>
            </NButton>
            <NP><b>{{ title }}</b></NP>
            <NButton circle :disabled="disabledNext" @click="onNextClick">
                <template #icon>
                    <NIcon>
                        <ArrowForwardCircleOutline />
                    </NIcon>
                </template>
            </NButton>
        </NSpace>

        <!-- Context textarea -->
        <NFormItem>
            <NInput type="textarea" clearable show-count rows="6" placeholder="Description du contexe..." :value
                @update:value="onValueUpdate" />
        </NFormItem>
    </NSpace>
</template>

<script setup lang="ts">
import ArrowBackCircleOutline from 'vicons/ionicons-v5/ArrowBackCircleOutline.vue';
import ArrowForwardCircleOutline from 'vicons/ionicons-v5/ArrowForwardCircleOutline.vue';

type Props = {
    title: string;
    value?: string;
    disabledPrev?: boolean;
    disabledNext?: boolean;
};

type Emits = {
    (event: 'click:prev'): void;
    (event: 'click:next'): void;
    (event: 'update:value', newValue: string): void;
};

const props = withDefaults(defineProps<Props>(), {
    value: '',
    disabledPrev: false,
    disabledNext: false,
});
const emits = defineEmits<Emits>();

function onPrevClick() {
    emits('click:prev');
}

function onNextClick() {
    emits('click:next');
}

function onValueUpdate(newValue: string) {
    emits('update:value', newValue);
}
</script>