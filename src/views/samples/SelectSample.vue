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

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

const projects: Ref<Array<Project> | undefined> = ref()

async function getProjects() {
    const projects_retrieved = await projectRepository.getProjects({
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

    projects.value = projects_retrieved.data;
}

getProjects();
</script>

<template>
    <div class="flex flex-col gap-6 items-center justify-center mt-20">
        <DataTable class="w-1/2" v-if="projects" :columns="columns" :data="projects" />
    </div>
</template>
