<script setup lang="ts">
import { FileRepository } from '@/repositories/FileRepository';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import type { Project } from '@/repositories/types/entities/Project';
import type { ProjectFile } from '@/repositories/types/entities/ProjectFile';
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
const step: ModelRef<number> = defineModel('step', { required: true });
const sample_id: ModelRef<string> = defineModel('sample_id', { required: true });

async function deleteFile(file: ProjectFile) {
    await fileRepository.deleteFile({
        bearerToken: authStore.getToken ?? '',
        fileId: file.id,
        projectId: sample_id.value,
        organizationId: userStore.getDefaultOrg?.id ?? ''
    });

    const project_retrieved = await projectRepository.getProjectById({
        bearerToken: authStore.getToken ?? '',
        projectId: sample_id.value,
        orgId: userStore.defaultOrg?.id ?? ''
    });
}

function filterName(name: string) {
    return name.replace(".fastq.gz", "")
}

</script>

<template>
    <UploadForm v-model:step="step" v-model:sample_id="sample_id"></UploadForm>
    <div class="flex flex-col gap-2 items-center">
        <span class="font-bold">File uploaded</span>
        <!-- <div v-for="file in selected_project.files" :key="file.id"
            class="flex w-full items-center gap-2 justify-between">
            <Icon class="w-1/8" icon="tabler:file"></Icon>
            <span class="w-6/8 text-wrap break-words"> {{ filterName(file.name) }}</span>
            <Icon class="cursor-pointer w-1/8 text-destructive" icon="iconoir:trash" @click="deleteFile(file)"></Icon>
        </div> -->
    </div>
    <Toaster />
</template>
