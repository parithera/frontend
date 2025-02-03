<script setup lang="ts">
import { BusinessLogicError } from '@/repositories/BaseRepository';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import type { Project } from '@/repositories/types/entities/Project';
import router from '@/router';
import { Button } from '@/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { MoreHorizontal } from 'lucide-vue-next'

defineProps<{
    project: {
        id: string
    }
}>()

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

defineEmits<{
    (e: 'expand'): void
}>()

function goToProject(project_id: string) {
    router.push({ name: 'results', params: { page: 'results', projectId: project_id } })
}

async function deleteProject(project_id: string) {
    try {
        await projectRepository.deleteProject({
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            projectId: project_id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            console.log(error);
        }
    }
    router.go(0)
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="w-8 h-8 p-0">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem @click="goToProject(project.id)">
                Open project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="deleteProject(project.id)">Delete project</DropdownMenuItem>
            <DropdownMenuItem @click="$emit('expand')">
                Expand
            </DropdownMenuItem>
            <!-- <DropdownMenuItem>Edit project</DropdownMenuItem> -->
        </DropdownMenuContent>
    </DropdownMenu>
</template>