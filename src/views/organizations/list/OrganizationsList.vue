<script lang="ts" setup>
import { BusinessLogicError } from '@/types/BaseRepository';
import { OrgRepository } from '@/views/organizations/organization.repository';
import { useAuthStore } from '@/stores/auth';
import { ref, watch, type Ref } from 'vue';
import { Icon } from '@iconify/vue';
import SearchBar from '@/common_components/SearchBar.vue';
import Pagination from '@/common_components/PaginationComponent.vue';
import OrgListItem from '@/views/organizations/list/OrganizationListItem.vue';
import type { OrganizationMembership } from '@/views/organizations/members/organization_membership.entity';
import Button from '@/shadcn/ui/button/Button.vue';

const search = ref('');
const placeholder = 'Search by organization name or role';
const authStore = useAuthStore();
const loading: Ref<boolean> = ref(true);
const totalEntries: Ref<number> = ref(0);
const totalPages: Ref<number> = ref(0);
const currentPage: Ref<number> = ref(0);
const entriesPerPage: Ref<number> = ref(10);
const errorCode: Ref<string> = ref('');
const error: Ref<boolean> = ref(false);
const orgRepo = new OrgRepository();
const memberships: Ref<OrganizationMembership[]> = ref([]);

async function fetch(refresh: boolean = false) {
    errorCode.value = '';
    error.value = false;
    if (authStore.getAuthenticated && authStore.getToken) {
        if (!refresh) loading.value = true;
        try {
            const _memberships = await orgRepo.getMany({
                bearerToken: authStore.getToken,
                handleBusinessErrors: true,
                pagination: {
                    page: currentPage.value,
                    entries_per_page: entriesPerPage.value
                }
            });
            memberships.value = _memberships.data;
            totalEntries.value = _memberships.total_entries;
            totalPages.value = _memberships.total_pages;
        } catch (_error) {
            error.value = true;
            if (_error instanceof BusinessLogicError) {
                errorCode.value = _error.error_code;
            }
        } finally {
            if (!refresh) loading.value = false;
        }
    }
}

function refresh() {
    fetch(true);
}

watch([search, currentPage], async () => {
    await fetch(true);
});

fetch();
</script>
<template>
    <div class="flex flex-col gap-8 p-12">
        <div class="flex flex-row justify-between items-center">
            <div class="flex gap-10 items-center">
                <div class="text-2xl flex flex-row gap-2 items-center">
                    <span>Organizations</span>
                    <span>Manage your organizations</span>
                </div>
                <div class="text-gray-500 font-medium">
                    Within this page you can find a list of all your organizations. You can create a
                    new organization, or manage your existing ones.
                </div>
            </div>
            <div class="text-sm">
                <RouterLink :to="{ name: 'orgs', params: { action: 'add', page: 'main' } }">
                    <Button class="rounded-full">
                        <Icon icon="ion:add-sharp" />
                        <div>Create an org</div>
                    </Button>
                </RouterLink>
            </div>
        </div>

        <SearchBar v-model:search-key="search" :placeholder="placeholder" />

        <div v-if="!loading">
            <Pagination
                v-model:page="currentPage"
                v-model:nmb-entries-showing="entriesPerPage"
                v-model:nmb-entries-total="totalEntries"
                v-model:total-pages="totalPages"
            >
                <template #content>
                    <div class="flex flex-row flex-wrap gap-4 text-grayTitle">
                        <OrgListItem
                            v-for="membership in memberships"
                            :key="membership.organization.id"
                            :membership="membership"
                            @refresh="refresh()"
                        ></OrgListItem>
                    </div>
                </template>
            </Pagination>
        </div>
    </div>
</template>
