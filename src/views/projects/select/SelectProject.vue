<script setup lang="ts">
import type { Project } from '@/views/projects/project.entity';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { ProjectRepository } from '@/views/projects/project.repository';

const authStore = useAuthStore();
const userStore = useUserStore();

import DataTable from './table/DataTable.vue';
import { columns } from './table/columns';

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

const projects: Ref<Array<Project> | undefined> = ref();

async function getProjects() {
    const projects_retrieved = await projectRepository.getProjects({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        pagination: {
            page: 0,
            entries_per_page: 100
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
        <DataTable v-if="projects" class="w-3/4" :columns="columns" :data="projects" />
    </div>
</template>
