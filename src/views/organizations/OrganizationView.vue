<script lang="ts" setup>
import { useStateStore } from '@/stores/state';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const OrganizationsList = defineAsyncComponent({
    loader: () => import('@/views/organizations/list/OrganizationsList.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrganizationCreate = defineAsyncComponent({
    loader: () => import('@/views/organizations/create/OrganizationCreate.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const ManageAuditLogs = defineAsyncComponent({
    loader: () => import('@/views/organizations/audit_logs/ManageAuditLogs.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const OrganizationManage = defineAsyncComponent({
    loader: () => import('@/views/organizations/manage/OrganizationManage.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const ManageMembers = defineAsyncComponent({
    loader: () => import('@/views/organizations/members/ManageMembers.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const ManageInvites = defineAsyncComponent({
    loader: () => import('@/views/organizations/invites/manage/ManageInvites.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const InviteCreate = defineAsyncComponent({
    loader: () => import('@/views/organizations/invites/create/InviteCreate.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const AnalyzersView = defineAsyncComponent({
    loader: () => import('@/views/analyzers/AnalyzersView.vue'),
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
        <OrganizationCreate v-if="props.action == 'add' && !props.orgId" />
        <OrganizationsList v-else-if="props.action == 'list' && !props.orgId" />

        <ManageAuditLogs
            v-if="props.page == 'logs' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <ManageMembers
            v-else-if="props.page == 'members' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <InviteCreate
            v-else-if="props.page == 'invites' && props.action == 'add' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <ManageInvites
            v-else-if="props.page == 'invites' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
        <AnalyzersView
            v-else-if="props.page == 'analyzers' && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
            :action="props.action"
        />
        <OrganizationManage
            v-else-if="props.page && props.orgId"
            :page="props.page"
            :orgId="props.orgId"
        />
    </main>
</template>
