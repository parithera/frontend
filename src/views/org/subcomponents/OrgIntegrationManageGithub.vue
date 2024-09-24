<script lang="ts" setup>
import { BusinessLogicError } from '@/repositories/BaseRepository';
import { IntegrationsRepository } from '@/repositories/IntegrationsRepository';
import {
    IntegrationProvider,
    type GithubIntegration
} from '@/repositories/types/entities/Integrations';
import { APIErrors } from '@/repositories/types/errors/ApiErrors';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import OrgIntegrationManageTokenBasedIntegration from '@/views/org/subcomponents/OrgIntegrationManageTokenBasedIntegration.vue';
import { errorToast, successToast } from '@/utils/toasts';
import { GithubTokenType } from '@/repositories/types/postBodies/IntegrationAdd';

const integration: Ref<GithubIntegration | undefined> = ref();

// Repositories
const integrationRepo: IntegrationsRepository = new IntegrationsRepository();

// State
const orgId: Ref<string | undefined> = ref();
const integrationId: Ref<string | undefined> = ref();
const error: Ref<boolean> = ref(false);
const errorCode: Ref<string | undefined> = ref('');
const loading: Ref<boolean> = ref(false);

// Stores
const authStore = useAuthStore();

async function fetchIntegration() {
    if (!orgId.value || !integrationId.value) return;
    if (!(authStore.getAuthenticated && authStore.getToken)) return;

    error.value = false;
    errorCode.value = undefined;

    try {
        const _integration = await integrationRepo.getGithubIntegration({
            orgId: orgId.value,
            integrationId: integrationId.value,
            bearerToken: authStore.getToken,
            handleBusinessErrors: true
        });

        integration.value = _integration;
    } catch (_err) {
        error.value = true;
        if (_err instanceof BusinessLogicError) {
            errorCode.value = _err.error_code;
        }
    } finally {
        loading.value = false;
    }
}

async function init() {
    const route = useRoute();
    const _orgId = route.params.orgId;
    const _integrationId = route.params.integrationId;

    if (!_orgId || !_integrationId) {
        router.back();
    }

    if (typeof _orgId == 'string' && typeof _integrationId == 'string') {
        orgId.value = _orgId;
        integrationId.value = _integrationId;
        await fetchIntegration();
    } else {
        router.back();
    }
}

async function deleteIntegration() {
    if (!orgId.value || !integrationId.value) return;
    if (!(authStore.getAuthenticated && authStore.getToken)) return;

    try {
        await integrationRepo.deleteGithubIntegration({
            orgId: orgId.value,
            integrationId: integrationId.value,
            bearerToken: authStore.getToken,
            handleBusinessErrors: true
        });

        successToast('Succesfully deleted the integration');
        router.push({ name: 'orgManage', params: { page: 'integrations' } });
    } catch (_err) {
        if (_err instanceof BusinessLogicError) {
            if (_err.error_code == APIErrors.NotAuthorized) {
                errorToast('You are not authorized to perform this action.');
            } else if (_err.error_code == APIErrors.EntityNotFound) {
                errorToast('Succesfully deleted the integration');
            } else if (_err.error_code == APIErrors.InternalError) {
                errorToast('Failed to delete the integration.');
            } else {
                errorToast('Failed to delete the integration.');
            }
        } else {
            errorToast('Failed to delete the integration.');
        }
    }
}

init();
</script>
<template>
    <main class="p-12">
        <OrgIntegrationManageTokenBasedIntegration
            v-if="!loading && integration != undefined && integration != null"
            :error="error"
            :error-code="errorCode"
            :integration="integration"
            :provider="IntegrationProvider.GITHUB"
            :update-route="{
                name: 'orgUpdateIntegration',
                params: { orgId: orgId, provider: IntegrationProvider.GITHUB },
                query: { update: integrationId }
            }"
            @refresh="fetchIntegration()"
            @delete="deleteIntegration()"
        >
            <template #header-integration-icon>
                <Icon icon="devicon:github" class="icon integration-icon"></Icon>
            </template>
            <template #header-integration-name> Github </template>
            <template #header-integration-description>
                Your organization is linked to Github.
            </template>
            <template #token-type>
                <div v-if="integration.token_type == GithubTokenType.CLASSIC_TOKEN">
                    Classic Token
                </div>
                <div v-else-if="integration.token_type == GithubTokenType.OAUTH_TOKEN">
                    OAuth Token
                </div>
            </template>
        </OrgIntegrationManageTokenBasedIntegration>
    </main>
</template>
