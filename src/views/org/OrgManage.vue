<script lang="ts" setup>
import { useStateStore } from '@/stores/state';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const OrgManageAuditLogs = defineAsyncComponent({
    loader: () => import('@/views/org/audit_logs/OrgManageAuditLogs.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

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
    loader: () => import('@/views/org/members/OrgManageMembers.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManageInvites = defineAsyncComponent({
    loader: () => import('@/views/org/invites/OrgManageInvites.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgManageInviteCreate = defineAsyncComponent({
    loader: () => import('@/views/org/invites/OrgManageInviteCreate.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrgAnalyzers = defineAsyncComponent({
    loader: () => import('@/views/org/analyzers/OrgAnalyzers.vue'),
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
    action?: string;
    page?: string;
    orgId?: string;
}>();
</script>
<template>
    <main>
        <OrgManageAuditLogs
            v-if="props.page == 'logs' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <OrgManageMembers
            v-else-if="props.page == 'members' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <OrgManageInviteCreate
            v-else-if="props.page == 'invites' && props.action == 'add' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <OrgManageInvites
            v-else-if="props.page == 'invites' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <OrgAnalyzers
            v-else-if="props.page == 'analyzers' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
            :action="props.action"
        />
        <OrgManageOverview
            v-else-if="props.page && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
    </main>
</template>
