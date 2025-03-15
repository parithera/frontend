<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import SelectSample from './select/SelectSample.vue';
import QualityControl from './quality_control/QualityControl.vue';

const state = useStateStore();
state.$reset();
state.page = 'samples';

defineProps<{
    page: string;
}>();

</script>

<template>
    <QualityControl v-if="page == 'qc'"></QualityControl>
    <SelectSample v-else />
</template>
