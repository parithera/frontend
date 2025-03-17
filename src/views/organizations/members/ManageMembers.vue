<script lang="ts" setup>
import { BusinessLogicError } from '@/types/BaseRepository';
import { OrgRepository } from '@/views/organizations/organization.repository';
import {
    MemberRole,
    type Organization,
    isMemberRoleGreaterThan
} from '@/views/organizations/organization.entity';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import OrgHeaderItem from '@/views/organizations/subcomponents/OrganizationHeaderItem.vue';
import { APIErrors } from '@/types/ApiErrors';
import { Icon } from '@iconify/vue';
import { SortDirection } from '@/types/PaginatedRequestOptions';
import Button from '@/shadcn/ui/button/Button.vue';
import type { OrganizationMembership } from '@/views/organizations/members/organization_membership.entity';

const orgRepo = new OrgRepository();
const authStore = useAuthStore();

const search: Ref<string> = ref('');
const loadingMembers: Ref<boolean> = ref(false);
const orgInfo: Ref<Organization | undefined> = ref();
const errorCodeMembers: Ref<string> = ref('');
const errorMembers: Ref<boolean> = ref(false);
const orgId: Ref<string> = ref('');
const orgMembers: Ref<OrganizationMembership[]> = ref([]);
const totalEntries: Ref<number> = ref(0);
const totalPages: Ref<number> = ref(0);
const currentPage: Ref<number> = ref(0);
const entriesPerPage: Ref<number> = ref(10);
const sortDirection: Ref<SortDirection> = ref(SortDirection.DESC);
const sortKey: Ref<string> = ref('role');

async function fetchOrganizationMembers(refresh: boolean = false) {
    if (!orgId.value) return;
    if (authStore.getAuthenticated && authStore.getToken) {
        errorMembers.value = false;
        errorCodeMembers.value = '';
        if (!refresh) loadingMembers.value = true;
        try {
            const resp = await orgRepo.getOrgMembers({
                orgId: orgId.value,
                bearerToken: authStore.getToken,
                search: {
                    searchKey: search.value
                },
                pagination: {
                    page: currentPage.value,
                    entries_per_page: entriesPerPage.value
                },
                sort: {
                    sortKey: sortKey.value,
                    sortDirection: sortDirection.value
                },
                handleBusinessErrors: true
            });
            orgMembers.value = resp.data;
            totalEntries.value = resp.total_entries;
            totalPages.value = resp.total_pages;
        } catch (err) {
            errorMembers.value = true;
            if (err instanceof BusinessLogicError) {
                errorCodeMembers.value = err.error_code;
            }
        } finally {
            if (!refresh) loadingMembers.value = false;
        }
    }
}

onMounted(() => {
    init();
});

function init() {
    const route = useRoute();
    const _orgId = route.params.orgId;

    if (!_orgId) {
        router.back();
    }

    if (typeof _orgId == 'string') {
        orgId.value = _orgId;
        fetchOrganizationMembers();
    } else {
        router.back();
    }
}

function setOrgInfo(_orgInfo: Organization) {
    orgInfo.value = _orgInfo;
    if (!isMemberRoleGreaterThan(_orgInfo.role, MemberRole.USER)) {
        router.push({ name: 'orgManage', params: { page: '', orgId: _orgInfo.id } });
    }
}
</script>
<template>
    <div class="flex flex-col gap-8 org-members-manage-wrapper">
        <OrgHeaderItem
            v-if="orgId"
            :org-id="orgId"
            @on-org-info="setOrgInfo($event)"
        ></OrgHeaderItem>
        <div v-if="orgInfo" class="flex flex-col gap-8 p-12">
            <div
                v-if="
                    (!orgInfo.personal && orgInfo.role == MemberRole.OWNER) ||
                    orgInfo.role == MemberRole.ADMIN ||
                    orgInfo.role == MemberRole.MODERATOR
                "
            >
                <h2 class="text-2xl font-semibold mb-4">Related Actions</h2>
                <div class="flex flex-row gap-4 flex-wrap items-stretch org-manage-items">
                    <RouterLink
                        :to="{
                            name: 'orgs',
                            params: { orgId: orgId, page: 'invites', action: 'add' }
                        }"
                    >
                        <Button> Invite another User </Button>
                    </RouterLink>
                    <RouterLink
                        :to="{
                            name: 'orgs',
                            params: { orgId: orgId, page: 'invites', action: 'manage' }
                        }"
                    >
                        <Button> Manage organization invites </Button>
                    </RouterLink>
                </div>
            </div>
            <div>
                <h2 class="text-2xl font-semibold mb-4">Member Management</h2>
                <div v-if="!errorMembers" class="flex flex-col gap-5 org-members-list-wrapper">
                    <div v-for="member of orgMembers">
                        {{ member.user.first_name }} {{ member.user.last_name }}
                    </div>
                </div>
                <div v-else>
                    <div class="flex flex-row gap-2" style="font-size: 1.2em">
                        <Icon
                            class="icon user-icon"
                            icon="solar:confounded-square-outline"
                            style="font-size: 2.5rem; height: fit-content"
                        ></Icon>
                        <div>
                            <div class="flex flex-col gap-5">
                                <div class="flex flex-col gap-2">
                                    <div>We failed to retrieve the organization's members</div>
                                    <div style="font-size: 0.7em">
                                        <div v-if="errorCodeMembers == APIErrors.EntityNotFound">
                                            This organization does not exist.
                                        </div>
                                        <div v-if="errorCodeMembers == APIErrors.NotAuthorized">
                                            You do not have permission to access the organization's
                                            members..
                                        </div>
                                        <div v-else>
                                            You can try again, and if the error persits, then please
                                            contact the webmaster.
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row gap-2 items-center flex-wrap">
                                    <Button
                                        v-if="errorCodeMembers != APIErrors.NotAuthorized"
                                        @click="fetchOrganizationMembers"
                                    >
                                        Try again
                                    </Button>
                                    <Button @click="router.push({ name: 'orgs' })">
                                        Go back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
