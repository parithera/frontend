<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import ChatView from './results/ChatView.vue';

const state = useStateStore();
state.$reset();

state.page = 'results';

defineProps<{
    page?: string;
}>();

</script>
<template>
    <ChatView v-if="page =='results'"></ChatView>
</template>