<script setup lang="ts">
import type { Project } from '@/repositories/types/entities/Project';
import Button from '@/shadcn/ui/button/Button.vue';
import { ref, type Ref } from 'vue';
import Card from '@/shadcn/ui/card/Card.vue';
import CardHeader from '@/shadcn/ui/card/CardHeader.vue';
import CardContent from '@/shadcn/ui/card/CardContent.vue';
import CardTitle from '@/shadcn/ui/card/CardTitle.vue';
import CardDescription from '@/shadcn/ui/card/CardDescription.vue';
import CardFooter from '@/shadcn/ui/card/CardFooter.vue';
import Skeleton from '@/shadcn/ui/skeleton/Skeleton.vue';
import Alert from '@/shadcn/ui/alert/Alert.vue';
import { Terminal } from 'lucide-vue-next';
import AlertTitle from '@/shadcn/ui/alert/AlertTitle.vue';
import AlertDescription from '@/shadcn/ui/alert/AlertDescription.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { BusinessLogicError } from '@/repositories/BaseRepository';
import CreateProjectForm from './CreateProjectForm.vue';

const authStore = useAuthStore();
const userStore = useUserStore();

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shadcn/ui/table'
import { Icon } from '@iconify/vue/dist/iconify.js';
import { Badge } from '@/shadcn/ui/badge';
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

async function deleteProject(project: Project) {
    try {
        await projectRepository.deleteProject({
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            projectId: project.id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            console.log(error);
        }
    }
    await getProjects();
}

getProjects();
</script>

<template>
    <div v-if="projects?.length == 0" class="flex flex-col gap-6 items-center justify-center mt-20">
        <Card class="w-72">
            <CardHeader>
                <CardTitle>No Project found</CardTitle>
                <CardDescription> Please create a new project </CardDescription>
            </CardHeader>
            <CardContent class="grow flex flex-col gap-2">
                <span class="flex gap-2">
                    <Skeleton class="w-12 h-6"></Skeleton>
                    <Skeleton class="w-12 h-6"></Skeleton>
                </span>
                <Skeleton class="w-40 h-6"></Skeleton>
                <Skeleton class="w-40 h-6"></Skeleton>
                <Skeleton class="self-center w-48 h-24"></Skeleton>
            </CardContent>
            <CardFooter class="flex gap-4 justify-center">
                <CreateProjectForm />
            </CardFooter>
        </Card>
    </div>
    <div v-else class="flex flex-col gap-6 items-center justify-center mt-20">
        <!-- <Alert class="w-1/2">
            <Terminal class="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                Please select a project from the list or create a new one.
            </AlertDescription>
        </Alert> -->
        <DataTable class="w-1/2" v-if="projects" :columns="columns" :data="projects" />
    </div>
</template>
