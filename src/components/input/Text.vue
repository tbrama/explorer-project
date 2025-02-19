<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
    id: String,
    label: String,
    placeholder: String,
    modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const valInput = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newVal) => {
        valInput.value = newVal;
    }
);
</script>

<template>
    <div class="relative">
        <label :for="id">{{ label }}</label>
        <input type="text" :id="id" :placeholder="placeholder" class="p-2 border border-ex-grayblue rounded-lg"
            v-model="valInput" @keyup="emit('update:modelValue', valInput)">
    </div>
</template>

<style scoped></style>