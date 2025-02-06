<script setup lang="ts">
import { BusinessLogicError } from '@/repositories/BaseRepository';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import type { Project } from '@/repositories/types/entities/Project';
import router from '@/router';
import { Button } from '@/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { MoreHorizontal } from 'lucide-vue-next'

defineProps<{
    sample: {
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
    router.push({ name: 'sample', params: { page: 'results', projectId: project_id } })
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
    <div>
        <Button class="flex gap-2 items-center" variant="ghost" @click="goToProject(sample.id)">
            <RouterLink :to="{ name: 'samples', params: { page: 'qc' }, query: { sampleId: sample.id } }">
                🔎 Show QC
            </RouterLink>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button class="flex gap-2 items-center" variant="ghost">
                    <Icon icon="tabler:dots"></Icon> More
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="deleteProject(sample.id)">Delete project</DropdownMenuItem>
                <!-- <DropdownMenuItem @click="$emit('expand')">
                    Expand
                </DropdownMenuItem> -->
                <!-- <DropdownMenuItem>Edit project</DropdownMenuItem> -->
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>