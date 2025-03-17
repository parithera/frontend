<script setup lang="ts">
import { SampleRepository } from '@/views/samples/sample.repository';
import { Sample } from '@/views/samples/sample.entity';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { onMounted, ref, type ModelRef, type Ref } from 'vue';
import DataTable from './table/DataTable.vue';
import { columns } from './table/columns';

defineProps<{
    projectId: string;
}>();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Refs
const samples_available: Ref<Array<Sample>> = ref([]);

// Models
const samples: ModelRef<Array<Sample>> = defineModel('samples', { required: true, type: Array<Sample> });

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

onMounted(async () => {
    const res = await sampleRepository.getSamples({
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

    samples_available.value = res.data;
});
</script>

<template>
    <DataTable
        v-model:samples="samples"
        :columns="columns"
        :data="samples_available"
        :project_id="projectId"
    />
</template>
