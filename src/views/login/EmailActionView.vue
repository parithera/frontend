<script lang="ts" setup>
import { useStateStore } from '@/stores/state';
import PasswordResetForm from './password_reset/PasswordResetForm.vue';
import ConfirmRegistration from './confirm_registration/ConfirmRegistration.vue';
import OrganizationJoin from '../organizations/invites/join/OrganizationJoin.vue';

const state = useStateStore();
state.$reset();

state.page = 'emailAction';

const props = defineProps<{
    page?: string;
}>();
</script>
<template>
    <main class="p-12">
        <OrganizationJoin v-if="props.page == 'join_org'" />
        <PasswordResetForm v-else-if="props.page == 'reset_password'"></PasswordResetForm>
        <ConfirmRegistration v-else></ConfirmRegistration>
    </main>
</template>
