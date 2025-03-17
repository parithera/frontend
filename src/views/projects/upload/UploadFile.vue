<script setup lang="ts">
import { FileRepository } from '@/views/projects/file.repository';
import { ProjectRepository } from '@/views/projects/project.repository';
import { Project } from '@/views/projects/project.entity';
import type { ProjectFile } from '@/views/projects/project_file.entity';
import Toaster from '@/shadcn/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { type ModelRef } from 'vue';
import UploadForm from './upload/UploadForm.vue';

// Repositories
const fileRepository: FileRepository = new FileRepository();
const projectRepository: ProjectRepository = new ProjectRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Models
const selected_project: ModelRef<Project> = defineModel('selectedProject', { required: true, type: Project });
const create_groups: ModelRef<boolean> = defineModel('createGroups', { required: true, type: Boolean });

async function deleteFile(file: ProjectFile) {
    await fileRepository.deleteFile({
        bearerToken: authStore.getToken ?? '',
        fileId: file.id,
        projectId: selected_project.value.id,
        organizationId: userStore.getDefaultOrg?.id ?? ''
    });

    const project_retrieved = await projectRepository.getProjectById({
        bearerToken: authStore.getToken ?? '',
        projectId: selected_project.value.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });
    selected_project.value = project_retrieved.data;
}

function filterName(name: string) {
    return name.replace('.fastq.gz', '');
}
</script>

<template>
    <UploadForm
        v-model:selected_project="selected_project"
        v-model:create_groups="create_groups"
    ></UploadForm>
    <div class="flex flex-col gap-2 items-center">
        <span class="font-bold">File uploaded</span>
        <div
            v-for="file in selected_project.files"
            :key="file.id"
            class="flex w-full items-center gap-2 justify-between"
        >
            <Icon class="w-1/8" icon="tabler:file"></Icon>
            <span class="w-6/8 text-wrap break-words"> {{ filterName(file.name) }}</span>
            <Icon
                class="cursor-pointer w-1/8 text-destructive"
                icon="iconoir:trash"
                @click="deleteFile(file)"
            ></Icon>
        </div>
    </div>
    <Toaster />
</template>
