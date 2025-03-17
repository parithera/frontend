<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import { defineAsyncComponent } from 'vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import ErrorComponent from '@/common_components/ErrorComponent.vue';

const state = useStateStore();
state.$reset();

state.page = 'results';

defineProps<{
    page?: string;
}>();

const ChatView = defineAsyncComponent({
    loader: () => import('@/views/results/chat/ChatView.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});
</script>
<template>
    <ChatView v-if="page == 'results'"></ChatView>
</template>
