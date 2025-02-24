<script setup lang="ts">
import { SampleRepository } from '@/repositories/SampleRepository';
import DataTable from './table/DataTable.vue';
import { columns } from './table/columns';
import { ref, type Ref } from 'vue';
import type { Sample } from '@/repositories/types/entities/Sample';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

export interface Dataset {
    name: string;
    disease: string;
    platform: string;
    organism: string;
    reads: string;
    study: string;
    explore: string;
}

const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

const samples: Ref<Array<Sample>> = ref([])

async function getSamples() {
    const samples_retrieved = await sampleRepository.getPublicSamples({
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

getSamples();

</script>

<template>
    <div class="flex flex-col gap-6 items-center justify-center mt-20">
        <DataTable class="w-3/4" :columns="columns" :data="samples" />
    </div>
</template>
