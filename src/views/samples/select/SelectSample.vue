<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

const authStore = useAuthStore();
const userStore = useUserStore();

import DataTable from './table/DataTable.vue';
import { columns } from './table/columns';
import { SampleRepository } from '@/views/samples/sample.repository';
import type { Sample } from '@/views/samples/sample.entity';
import type { FilterOption } from './table/DataTableFacetedFilter.vue';

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

const samples: Ref<Array<Sample> | undefined> = ref();
const tags: Ref<Array<FilterOption>> = ref([]);

async function getSamples() {
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

    for (const sample of samples.value) {
        for (const tag of sample.tags) {
            const filter_tag: FilterOption = {
                label: tag,
                value: tag
            };
            if (!tags.value.includes(filter_tag)) {
                tags.value.push(filter_tag);
            }
        }
    }
}

getSamples();
</script>

<template>
    <div class="flex flex-col gap-6 items-center justify-center mt-20">
        <DataTable
            v-if="samples"
            class="w-3/4"
            :columns="columns"
            :data="samples"
            :tags="
                Array.from(new Set(tags.map((tag) => JSON.stringify(tag)))).map((str) =>
                    JSON.parse(str)
                )
            "
        />
    </div>
</template>
