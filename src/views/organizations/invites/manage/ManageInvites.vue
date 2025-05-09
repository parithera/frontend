<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from 'vue';
import OrgHeaderItem from '@/views/organizations/subcomponents/OrganizationHeaderItem.vue';
import router from '@/router';
import type { Organization } from '@/views/organizations/organization.entity';
import { isMemberRoleGreaterThan, MemberRole } from '@/views/organizations/organization.entity';
import type { Invitation } from '@/views/organizations/invites/invitation.entity';
import { OrgRepository } from '@/views/organizations/organization.repository';
import { useAuthStore } from '@/stores/auth';
import { SortDirection } from '@/types/PaginatedRequestOptions';
import { BusinessLogicError } from '@/types/BaseRepository';
import Pagination from '@/common_components/PaginationComponent.vue';
import SearchBar from '@/common_components/SearchBar.vue';
import { debounce } from '@/utils/searchUtils';
import BoxLoader from '@/common_components/BoxLoader.vue';
import Button from '@/shadcn/ui/button/Button.vue';

const placeholder = 'Search by invitee email, inviter email, or inviter handle';
const orgRepository = new OrgRepository();
const authStore = useAuthStore();

const search: Ref<string> = ref('');
const orgInfo: Ref<Organization | undefined> = ref();
const invitations: Ref<Invitation[]> = ref([]);

const currentPage: Ref<number> = ref(0);
const entriesPerPage: Ref<number> = ref(10);
const totalEntries: Ref<number> = ref(0);
const totalPages: Ref<number> = ref(0);
const error: Ref<boolean> = ref(false);
const errorCode: Ref<string | undefined> = ref();
const loading: Ref<boolean> = ref(true);
const sortDirection: Ref<SortDirection> = ref(SortDirection.ASC);
const sortKey: Ref<string> = ref('invited_on');

const props = defineProps<{
    page?: string;
    orgId: string;
}>();

watch([currentPage, entriesPerPage], async () => {
    await fetchInvitations(true);
});

async function fetchInvitations(refresh: boolean = false) {
    if (!(authStore.getAuthenticated && authStore.getToken)) return;

    error.value = false;
    errorCode.value = undefined;
    if (!refresh) loading.value = true;

    try {
        const resp = await orgRepository.getInvitations({
            orgId: props.orgId,
            bearerToken: authStore.getToken,
            pagination: {
                page: currentPage.value,
                entries_per_page: entriesPerPage.value
            },
            search: {
                searchKey: search.value
            },
            sort: {
                sortKey: sortKey.value,
                sortDirection: sortDirection.value
            }
        });
        invitations.value = resp.data;
        totalEntries.value = resp.total_entries;
        totalPages.value = resp.total_pages;
    } catch (err) {
        error.value = true;
        if (err instanceof BusinessLogicError) {
            errorCode.value = err.error_code;
        }
    } finally {
        loading.value = false;
    }
}

function setOrgInfo(_orgInfo: Organization) {
    orgInfo.value = _orgInfo;
    if (!isMemberRoleGreaterThan(_orgInfo.role, MemberRole.USER)) {
        router.push({ name: 'orgs', params: { page: '', orgId: _orgInfo.id } });
    }
}

watch([search], async () => {
    debounce(async () => {
        await fetchInvitations(true);
    }, 250);
});

onMounted(() => {
    fetchInvitations();
});
</script>
<template>
    <div class="flex flex-col gap-8 org-member-invitation-wrapper">
        <OrgHeaderItem
            v-if="orgId"
            :org-id="orgId"
            @on-org-info="setOrgInfo($event)"
        ></OrgHeaderItem>
        <div v-if="orgInfo && orgId" class="flex flex-col gap-8 p-12">
            <div>
                <h2 class="text-2xl font-semibold">Related Actions</h2>
                <div class="flex flex-row gap-4 flex-wrap items-stretch org-manage-items">
                    <template
                        v-if="
                            (!orgInfo.personal && orgInfo.role == MemberRole.OWNER) ||
                            orgInfo.role == MemberRole.ADMIN ||
                            orgInfo.role == MemberRole.MODERATOR
                        "
                    >
                        <RouterLink
                            :to="{
                                name: 'orgs',
                                params: { action: 'add', page: 'invites', orgId: orgId }
                            }"
                        >
                            <Button variant="outline">Invite another User</Button>
                        </RouterLink>
                        <RouterLink
                            :to="{ name: 'orgs', params: { orgId: orgId, page: 'members' } }"
                        >
                            <Button variant="outline">Manage organization members</Button>
                        </RouterLink>
                    </template>
                </div>
            </div>
            <div>
                <h2>Open invitations</h2>
                <div v-if="loading">
                    <div class="flex flex-col gap-2 justify-between" style="padding: 5px">
                        <BoxLoader
                            v-for="i in 10"
                            :key="i"
                            :dimensions="{ width: '100%', height: '50px' }"
                        />
                    </div>
                </div>
                <div v-else>
                    <div v-if="!error" class="flex flex-col gap-5 org-members-list-wrapper">
                        <SearchBar v-model:search-key="search" :placeholder="placeholder" />

                        <Pagination
                            v-model:page="currentPage"
                            v-model:nmb-entries-showing="entriesPerPage"
                            v-model:nmb-entries-total="totalEntries"
                            v-model:total-pages="totalPages"
                        >
                            <template #content>
                                <div
                                    v-if="totalEntries == 0 && search != ''"
                                    class="flex flex-row gap-4 justify-center"
                                    style="margin-top: 10px"
                                >
                                    No invites match your search
                                </div>
                                <div
                                    v-if="totalEntries == 0 && search == ''"
                                    class="flex flex-row gap-4 justify-center"
                                    style="margin-top: 10px"
                                >
                                    No open invites
                                </div>
                            </template>
                        </Pagination>
                    </div>
                    <div v-else>
                        {{ errorCode }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
