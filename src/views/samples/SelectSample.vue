<script setup lang="ts">
import type { Project } from '@/repositories/types/entities/Project';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { ProjectRepository } from '@/repositories/ProjectRepository';

const authStore = useAuthStore();
const userStore = useUserStore();

import DataTable from './table/DataTable.vue';
import { columns } from './table/columns';
import { SampleRepository } from '@/repositories/SampleRepository';
import type { Sample } from '@/repositories/types/entities/Sample';

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

const samples: Ref<Array<Sample> | undefined> = ref()

async function getProjects() {
    const samples_retrieved = await sampleRepository.getSamples({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        pagination: {
            page: 0,
            entries_per_page: 0
        },
        search: {
            searchKey: ''
        },
        sort: {
            sortKey: '',
            sortDirection: undefined
        }
    });

    samples.value = samples_retrieved.data;
}

getProjects();
</script>

<template>
    <div class="flex flex-col gap-6 items-center justify-center mt-20">
        <DataTable class="w-1/2" v-if="samples" :columns="columns" :data="samples" />
    </div>
</template>
