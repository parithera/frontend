<script setup lang="ts">
import { AnalyzerRepository } from '@/repositories/AnalyzerRepository';
import { FileRepository } from '@/repositories/FileRepository';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import type { Project } from '@/repositories/types/entities/Project';
import type { ProjectFile } from '@/repositories/types/entities/ProjectFile';
import Button from '@/shadcn/ui/button/Button.vue';
import { FormField } from '@/shadcn/ui/form';
import FormControl from '@/shadcn/ui/form/FormControl.vue';
import FormDescription from '@/shadcn/ui/form/FormDescription.vue';
import FormItem from '@/shadcn/ui/form/FormItem.vue';
import FormMessage from '@/shadcn/ui/form/FormMessage.vue';
import { useToast } from '@/shadcn/ui/toast';
import Toaster from '@/shadcn/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useForm } from 'vee-validate';
import type { ModelRef } from 'vue';

const props = defineProps<{
    fetchGraphs: (project: Project) => Promise<void>;
}>();

// Repositories
const fileRepository: FileRepository = new FileRepository();
const projectRepository: ProjectRepository = new ProjectRepository();
const analyzerRepository: AnalyzerRepository = new AnalyzerRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Models
const selected_project: ModelRef<Project> = defineModel('selected_project', { required: true });
const loading: ModelRef<boolean> = defineModel('loading', { required: true });

const { toast } = useToast();

const { handleSubmit } = useForm({
    // validationSchema: formSchema
});

const onFileSubmit = handleSubmit(async (values) => {
    const file: File = values.file as File;
    // const type: string = values.type as string;
    let file_name = file.name;
    if (file.name.includes('.h5')) {
        file_name = 'data.h5';
    }

    loading.value = true;
    await fileRepository.upload({
        bearerToken: authStore.getToken ?? '',
        data: {
            file: file,
            type: 'DATA',
            file_name: file_name
        },
        projectId: selected_project.value.id,
        organizationId: userStore.getDefaultOrg?.id ?? ''
    });

    toast({
        title: 'File uploaded successfully!',
        description: 'Please wait while we preprocess the file...'
    });

    const analyzer = await analyzerRepository.getAnalyzerByName({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        analyzer_name: 'initialization'
    });

    await projectRepository.createAnalysis({
        orgId: userStore.defaultOrg?.id ?? '',
        projectId: selected_project.value.id,
        bearerToken: authStore.getToken ?? '',
        handleBusinessErrors: true,
        data: {
            analyzer_id: analyzer.data.id,
            config: {
                r: {
                    project: selected_project.value.id,
                    user: selected_project.value.added_by?.id,
                    type: 'initialization'
                },
                fastqc: {
                    project: selected_project.value.id,
                    user: selected_project.value.added_by?.id
                }
            },
            branch: ' ', // This will be removed
            commit_hash: ' ' // This will be removed
        }
    });

    const project_retrieved = await projectRepository.getProjectById({
        bearerToken: authStore.getToken ?? '',
        projectId: selected_project.value.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    let files_length = project_retrieved.data.files?.length;

    while (files_length == 0) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const project_retrieved = await projectRepository.getProjectById({
            bearerToken: authStore.getToken ?? '',
            projectId: selected_project.value.id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
        files_length = project_retrieved.data.files?.length;
    }
    const project_retrieved_2 = await projectRepository.getProjectById({
        bearerToken: authStore.getToken ?? '',
        projectId: selected_project.value.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    selected_project.value = project_retrieved_2.data;
    await props.fetchGraphs(selected_project.value);
});

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
</script>

<template>
    <div
        v-if="!selected_project.files || selected_project.files.length == 0"
        class="bg-secondary rounded flex justify-evenly p-2"
    >
        <form class="flex flex-col gap-2 items-start" @submit="onFileSubmit">
            <FormField v-slot="{ componentField }" name="file">
                <FormItem>
                    <FormControl>
                        <input
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            type="file"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormDescription>Upload your gene sequencing file.</FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button type="submit" class="flex gap-2 items-center w-full">
                <Icon icon="bi:cloud-upload"></Icon> Upload
            </Button>
        </form>
    </div>
    <div v-else class="flex flex-col gap-2 items-center">
        <span class="font-bold">File analyzed</span>
        <div
            v-for="file in selected_project.files"
            :key="file.id"
            class="flex w-full items-center gap-2 justify-between"
        >
            <Icon class="w-1/8" icon="tabler:file"></Icon>
            <span class="w-6/8 text-wrap break-words"> {{ file.name }}</span
            ><Icon
                class="cursor-pointer w-1/8 text-destructive"
                icon="iconoir:trash"
                @click="deleteFile(file)"
            ></Icon>
        </div>
    </div>
    <Toaster />
</template>
