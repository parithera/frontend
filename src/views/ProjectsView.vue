<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import SelectProject from '@/views/projects/SelectProject.vue';
import QualityControl from './results/QualityControl.vue';

const state = useStateStore();
state.$reset();
state.page = 'projects';

defineProps<{
    page: string;
}>();

</script>

<template>
    <SelectProject/>
</template>
