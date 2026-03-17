<template>
    <NDatePicker v-bind="attrs" v-model:value="internalValue" />
</template>

<script setup lang="ts">
type Props = {
    value: string | undefined;
};

type Emits = {
    (event: 'update:value', value: string | null): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const attrs = useAttrs();

const internalValue = computed({
    get: () => (props.value ? Date.parse(props.value) : null),
    set: (newTimestamp) => {
        if (!newTimestamp) {
            emits('update:value', null);
            return;
        }

        const localDate = new Date(newTimestamp);
        const utcDate = new Date(Date.UTC(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate()
        ));

        emits("update:value", utcDate.toISOString());
    },
});
</script>