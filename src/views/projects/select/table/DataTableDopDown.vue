<script setup lang="ts">
import { BusinessLogicError } from '@/types/BaseRepository';
import { SampleRepository } from '@/views/samples/sample.repository';
import router from '@/router';
import { Button } from '@/shadcn/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/shadcn/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue';

defineProps<{
    project: {
        id: string;
    };
}>();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

defineEmits<{
    (e: 'expand'): void;
}>();

function goToProject(project_id: string) {
    router.push({ name: 'results', params: { page: 'results', projectId: project_id } });
}

async function deleteProject(project_id: string) {
    try {
        await sampleRepository.deleteProject({
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
    router.go(0);
}
</script>

<template>
    <div class="flex flex-col items-end">
        <!-- <Button class="flex gap-2 items-center" variant="ghost" @click="goToProject(project.id)">
            <Icon icon="tabler:folder-open"></Icon> Open
        </Button> -->
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button class="flex gap-2 items-center" variant="ghost">
                    <Icon icon="tabler:dots"></Icon> More
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem @click="goToProject(project.id)">
                    Open analysis
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="deleteProject(project.id)"
                    >Delete analysis</DropdownMenuItem
                >
                <DropdownMenuItem @click="$emit('expand')"> Expand </DropdownMenuItem>
                <!-- <DropdownMenuItem>Edit project</DropdownMenuItem> -->
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>
