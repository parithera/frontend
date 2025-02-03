<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import SelectSample from '@/views/samples/SelectSample.vue';

const state = useStateStore();
state.$reset();
state.page = 'samples';

defineProps<{
    page: string;
}>();

</script>

<template>
    <SelectSample/>
</template>
