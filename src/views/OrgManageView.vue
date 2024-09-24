<script lang="ts" setup>
import { useStateStore } from '@/stores/state';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const OrgManageOverview = defineAsyncComponent({
    loader: () => import('@/views/org/manage/OrgManageOverview.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManageMembers = defineAsyncComponent({
    loader: () => import('@/views/org/manage/OrgManageMembers.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManagePolicies = defineAsyncComponent({
    loader: () => import('@/views/org/manage/OrgManagePolicies.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManageInvites = defineAsyncComponent({
    loader: () => import('@/views/org/manage/OrgManageInvites.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManageAuditLogs = defineAsyncComponent({
    loader: () => import('@/views/org/manage/OrgManageAuditLogs.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManageIntegrations = defineAsyncComponent({
    loader: () => import('@/views/org/manage/OrgManageIntegrations.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManageAnalyzers = defineAsyncComponent({
    loader: () => import('@/views/org/manage/OrgManageAnalyzers.vue'),
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

const props = defineProps<{
    page?: string;
}>();
</script>
<template>
    <main>
        <OrgManageMembers v-if="props.page == 'members'" />
        <OrgManagePolicies v-else-if="props.page == 'policies'" />
        <OrgManageInvites v-else-if="props.page == 'invites'" />
        <OrgManageAuditLogs v-else-if="props.page == 'logs'" />
        <OrgManageIntegrations v-else-if="props.page == 'integrations'" />
        <OrgManageAnalyzers v-else-if="props.page == 'analyzers'" />
        <OrgManageOverview v-else />
    </main>
</template>
