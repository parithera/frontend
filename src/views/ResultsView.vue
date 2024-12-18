<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import ChatView from './results/ChatView.vue';
import QualityControl from './results/QualityControl.vue';
import { useConnectionStore } from '@/stores/connection';

const connectionStore = useConnectionStore();
connectionStore.$reset();

const state = useStateStore();
state.$reset();

state.page = 'results';

defineProps<{
    page?: string;
}>();

</script>
<template>
    <ChatView v-if="page =='results'"></ChatView>
    <QualityControl v-else></QualityControl>
</template>