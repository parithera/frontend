<script setup lang="ts">
import { FileRepository } from '@/repositories/FileRepository';
import type { ProjectFile } from '@/repositories/types/entities/ProjectFile';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { type ModelRef } from 'vue';
import UploadForm from './upload/UploadForm.vue';

const props = defineProps<{
    sample_id: string;
    align: Function;
}>();

// Repositories
const fileRepository: FileRepository = new FileRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Models
const files_uploaded: ModelRef<Array<ProjectFile>> = defineModel('files_uploaded', { required: true });

async function deleteFile(file: ProjectFile) {
    await fileRepository.deleteFile({
        bearerToken: authStore.getToken ?? '',
        fileId: file.id,
        projectId: props.sample_id,
        organizationId: userStore.getDefaultOrg?.id ?? ''
    });
}

function filterName(name: string) {
    name = name.replace('.fastq.gz','')
    if (name.length > 15) {
        return name.substring(0, 12) + '...';
    }
    return name
}

</script>

<template>
    <UploadForm :sample_id="sample_id" v-model:files_uploaded="files_uploaded" :align="align"></UploadForm>
    <div v-if="files_uploaded.length > 0" class="flex flex-col gap-2 items-center">
        <span class="font-bold">File uploaded</span>
        <div v-for="file in files_uploaded" :key="file.id"
            class="flex w-full items-center gap-2 justify-between">
            <Icon class="w-1/8" icon="tabler:file"></Icon>
            <span class="w-6/8 text-wrap break-words"> {{ filterName(file.name) }}</span>
            <Icon class="cursor-pointer w-1/8 text-destructive" icon="iconoir:trash" @click="deleteFile(file)"></Icon>
        </div>
    </div>
</template>
