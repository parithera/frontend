<script lang="ts" setup>
import {
    isMemberRoleGreaterOrEqualTo,
    MemberRole,
    Organization
} from '@/repositories/types/entities/Organization';
import router from '@/router';
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import OrgHeaderItem from '@/views/org/subcomponents/OrgHeaderItem.vue';
import { IntegrationProvider } from '@/repositories/types/entities/Integrations';
import OrgIntegrationAddGithub from './subcomponents/OrgIntegrationAddGithub.vue';
import OrgIntegrationAddGitlab from './subcomponents/OrgIntegrationAddGitlab.vue';

// Props
const props = defineProps<{
    provider: string;
}>();

const orgId: Ref<string> = ref('');
const orgInfo: Ref<Organization | undefined> = ref();

function setOrgInfo(_orgInfo: Organization) {
    orgInfo.value = _orgInfo;
    if (!isMemberRoleGreaterOrEqualTo(_orgInfo.role, MemberRole.ADMIN)) {
        router.push({ name: 'orgManage', params: { page: '', orgId: _orgInfo.id } });
    }
}

async function init() {
    const route = useRoute();
    const _orgId = route.params.orgId;

    if (!_orgId) {
        router.back();
    }

    if (typeof _orgId == 'string') {
        orgId.value = _orgId;
    } else {
        router.back();
    }
}

init();
</script>
<template>
    <div class="flex flex-col gap-8 org-manage-integration-create">
        <OrgHeaderItem
            v-if="orgId"
            :org-id="orgId"
            @on-org-info="setOrgInfo($event)"
        ></OrgHeaderItem>
        <div class="org-integrations-create-wrapper">
            <OrgIntegrationAddGithub
                v-if="props.provider == IntegrationProvider.GITHUB"
            ></OrgIntegrationAddGithub>
            <OrgIntegrationAddGitlab
                v-if="props.provider == IntegrationProvider.GITLAB"
            ></OrgIntegrationAddGitlab>
        </div>
    </div>
</template>
