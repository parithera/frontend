<script setup lang="ts">
import { FileRepository } from '@/views/projects/file.repository';
import type { ProjectFile } from '@/views/projects/project_file.entity';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { type ModelRef } from 'vue';
import UploadForm from './UploadForm.vue';

const props = defineProps<{
    sampleId: string;
    align: Function;
}>();

// Repositories
const fileRepository: FileRepository = new FileRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Models
const files_uploaded: ModelRef<Array<ProjectFile>> = defineModel('filesUploaded', {
    required: true,
    type: Array<ProjectFile>
});

async function deleteFile(file: ProjectFile) {
    await fileRepository.deleteFile({
        bearerToken: authStore.getToken ?? '',
        fileId: file.id,
        projectId: props.sampleId,
        organizationId: userStore.getDefaultOrg?.id ?? ''
    });
}

function filterName(name: string) {
    name = name.replace('.fastq.gz', '');
    if (name.length > 15) {
        return name.substring(0, 12) + '...';
    }
    return name;
}
</script>

<template>
    <UploadForm
        v-model:filesUploaded="files_uploaded"
        :sampleId="sampleId"
        :align="align"
    ></UploadForm>
    <div v-if="files_uploaded.length > 0" class="flex flex-col gap-2 items-center">
        <span class="font-bold">File uploaded</span>
        <div
            v-for="file in files_uploaded"
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
</template>
