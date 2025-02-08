<script lang="ts" setup>
import Alert from '@/shadcn/ui/alert/Alert.vue';
import AlertDescription from '@/shadcn/ui/alert/AlertDescription.vue';
import AlertTitle from '@/shadcn/ui/alert/AlertTitle.vue';
import { useStateStore } from '@/stores/state';
import { Terminal } from 'lucide-vue-next';
import SelectDataset from './datasets/SelectDataset.vue';

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
