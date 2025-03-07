<script lang="ts" setup>
import {
    isMemberRoleGreaterThan,
    MemberRole,
    type Organization
} from '@/repositories/types/entities/Organization';
import router from '@/router';
import { ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { debounce } from '@/utils/searchUtils';
import type { AuditLog } from '@/repositories/types/entities/AuditLog';
import { OrgRepository } from '@/repositories/OrganizationRepository';
import { useAuthStore } from '@/stores/auth';
import { BusinessLogicError } from '@/repositories/BaseRepository';
import OrgHeaderItem from '@/views/org/subcomponents/OrgHeaderItem.vue';

import { SortDirection } from '@/repositories/types/PaginatedRequestOptions';
import Button from '@/shadcn/ui/button/Button.vue';

const orgRepo = new OrgRepository();
const authStore = useAuthStore();

const loading: Ref<boolean> = ref(false);
const error: Ref<boolean> = ref(false);
const errorCode: Ref<string | undefined> = ref();
const search: Ref<string> = ref('');
const orgId: Ref<string> = ref('');
const orgInfo: Ref<Organization | undefined> = ref();
const totalEntries: Ref<number> = ref(0);
const currentPage: Ref<number> = ref(0);
const entriesPerPage: Ref<number> = ref(10);
const orgAuditLogs: Ref<AuditLog[]> = ref([]);
const totalPages = ref(0);

const sortDirection: Ref<SortDirection> = ref(SortDirection.DESC);
const sortKey: Ref<string> = ref('created_on');

function setOrgInfo(_orgInfo: Organization) {
    orgInfo.value = _orgInfo;
    if (!isMemberRoleGreaterThan(_orgInfo.role, MemberRole.USER)) {
        router.push({ name: 'orgManage', params: { page: '', orgId: _orgInfo.id } });
    }
}

watch([search], async () => {
    debounce(async () => {
        await fetchOrgAuditLogs(true);
    }, 250);
});

watch([currentPage, entriesPerPage], async () => {
    await changePage(currentPage.value);
});

async function changePage(_page: number) {
    currentPage.value = _page;
    await fetchOrgAuditLogs(true);
}

async function fetchOrgAuditLogs(refresh: boolean = false) {
    if (!orgId.value) return;
    if (authStore.getAuthenticated && authStore.getToken) {
        error.value = false;
        errorCode.value = undefined;
        if (!refresh) loading.value = true;
        try {
            const resp = await orgRepo.getOrgAuditLogs({
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
            orgAuditLogs.value = resp.data;
            totalEntries.value = resp.total_entries;
            totalPages.value = resp.total_pages;
        } catch (err) {
            error.value = true;
            if (err instanceof BusinessLogicError) {
                errorCode.value = err.error_code;
            }
        } finally {
            if (!refresh) loading.value = false;
        }
    }
}

async function init() {
    const route = useRoute();
    const _orgId = route.params.orgId;
    const _search = route.query.search;

    if (!_orgId) {
        router.back();
    }

    if (_search && typeof _search == 'string') {
        search.value = _search;
    }

    if (typeof _orgId == 'string') {
        orgId.value = _orgId;
        await fetchOrgAuditLogs();
    } else {
        router.back();
    }
}

init();
</script>
<template>
    <div class="flex flex-col gap-8 org-audit-log-wrapper">
        <OrgHeaderItem v-if="orgId" :org-id="orgId" @on-org-info="setOrgInfo($event)"></OrgHeaderItem>
        <div v-if="orgInfo" class="flex flex-col gap-8 p-12">
            <div v-if="
                (!orgInfo.personal && orgInfo.role == MemberRole.OWNER) ||
                orgInfo.role == MemberRole.ADMIN ||
                orgInfo.role == MemberRole.MODERATOR
            ">
                <h2 class="text-2xl font-semibold">Related Actions</h2>
                <div class="flex flex-row gap-4 flex-wrap items-stretch org-manage-items">
                    <RouterLink :to="{ name: 'orgs', params: { orgId: orgId, page: 'members', action: 'manage' } }">
                        <Button>Manage organization members </Button>
                    </RouterLink>
                </div>
            </div>
            <div>
                <h2 class="text-2xl font-semibold">Audit logs</h2>
                <div>
                    This will be present in the next version of the platform
                </div>
            </div>
        </div>
    </div>
</template>
