<script lang="ts" setup>
import { useStateStore } from '@/stores/state';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const AnalyzersList = defineAsyncComponent({
    loader: () => import('@/views/analyzers/list/AnalyzersList.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const AnalyzerCreate = defineAsyncComponent({
    loader: () => import('@/views/analyzers/create/AnalyzerCreate.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const state = useStateStore();
state.$reset();

state.page = 'orgs';

defineProps<{
    page: string;
    orgId: string;
    action?: string;
}>();
</script>
<template>
    <AnalyzersList v-if="action == 'manage'" :page="page" :orgId="orgId" />
    <AnalyzerCreate v-else-if="action == 'add'" :page="page" :orgId="orgId" />
</template>
