<script lang="ts" setup>
import { useStateStore } from '@/stores/state';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const PasswordResetRequestForm = defineAsyncComponent({
    loader: () => import('@/views/login/password_reset/PasswordResetRequestForm.vue'),
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

state.page = 'password-recovery';
state.publicPage = true;
</script>

<template>
    <main class="p-12">
        <PasswordResetRequestForm></PasswordResetRequestForm>
    </main>
</template>
