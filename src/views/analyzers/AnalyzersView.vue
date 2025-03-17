<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const AnalyzersList = defineAsyncComponent({
    loader: () => import('@/views/analyzers/list/AnalyzersList.vue'),
    loadingComponent: LoadingComponent,
    delay: 200,
    errorComponent: ErrorComponent,
    timeout: 3000
});

const AnalyzerCreate = defineAsyncComponent({
    loader: () => import('@/views/analyzers/create/AnalyzerCreate.vue'),
    loadingComponent: LoadingComponent,
    delay: 200,
    errorComponent: ErrorComponent,
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
    <AnalyzersList v-if="action === 'manage'" :page="page" :org-id="orgId" />
    <AnalyzerCreate v-else-if="action === 'add'" :page="page" :org-id="orgId" />
</template>
