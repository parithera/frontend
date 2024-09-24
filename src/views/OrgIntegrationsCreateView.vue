<script lang="ts" setup>
import { IntegrationProvider } from '@/repositories/types/entities/Integrations';
import { useStateStore } from '@/stores/state';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const OrgManageIntegrationCreate = defineAsyncComponent({
    loader: () => import('@/views/org/OrgManageIntegrationCreate.vue'),
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
    provider: IntegrationProvider;
}>();
</script>
<template>
    <main>
        <OrgManageIntegrationCreate :provider="props.provider" />
    </main>
</template>
