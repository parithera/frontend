<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import SelectDataset from './select/SelectDataset.vue';

const state = useStateStore();
state.$reset();
state.page = 'datasets';

defineProps<{
    page: string;
}>();
</script>

<template>
    <SelectDataset></SelectDataset>
</template>
