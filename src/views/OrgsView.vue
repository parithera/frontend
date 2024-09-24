<script lang="ts" setup>
import { useStateStore } from '@/stores/state';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const Orgs = defineAsyncComponent({
    loader: () => import('@/views/org/OrgsComponent.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const CreateOrgForm = defineAsyncComponent({
    loader: () => import('@/views/org/CreateOrgForm.vue'),
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
    <main class="p-12">
        <CreateOrgForm v-if="props.page == 'add'" />
        <Orgs v-else-if="props.page == 'list' || props.page == undefined || page == ''" />
    </main>
</template>
