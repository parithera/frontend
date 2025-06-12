<script setup lang="ts">
import Button from '@/shadcn/ui/button/Button.vue';
import { FormField } from '@/shadcn/ui/form';
import FormControl from '@/shadcn/ui/form/FormControl.vue';
import FormDescription from '@/shadcn/ui/form/FormDescription.vue';
import FormItem from '@/shadcn/ui/form/FormItem.vue';
import FormMessage from '@/shadcn/ui/form/FormMessage.vue';
import { toast } from '@/shadcn/ui/toast';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { computeHash } from '@/utils/crypto';
import { useForm } from 'vee-validate';
import Progress from '@/shadcn/ui/progress/Progress.vue';
import { ref, useTemplateRef, type ModelRef, type Ref } from 'vue';
import { ProjectFile } from '@/views/projects/project_file.entity';
import { SampleRepository } from '@/views/samples/sample.repository';
import Switch from '@/shadcn/ui/switch/Switch.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{
    sampleId: string;
    align: Function;
}>();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Models
const files_uploaded: ModelRef<Array<ProjectFile>> = defineModel('filesUploaded', {
    required: true,
    type: Array<ProjectFile>
});

// Refs
const progress_message: Ref<string> = ref('Uploading');
const progress_preprocess: Ref<number> = ref(0);
const uploading: Ref<boolean> = ref(false);

const input = useTemplateRef('input');
const selection_type: Ref<string> = ref('fastq');

function setSelectionType() {
    selection_type.value = input.value?.value.includes('fastq') ? 'fastq' : 'h5';
}

const { handleSubmit } = useForm({
    // validationSchema: formSchema
});

const onFileSubmit = handleSubmit(async (values) => {
    const files: Array<File> = values.file as Array<File>;
    let count_files = 0;
    uploading.value = true;

    try {
        for (const file of files) {
            let file_name = file.name;

            // Only rename if your backend requires 'out.h5' for .h5 files
            if (file.name.includes('.h5')) {
                file_name = 'out.h5';
            }

            const chunkSize = 1024 * 1024 * 10; // 10MB
            let start = 0;
            let id = 0;
            const maxRetries = 5;

            progress_message.value = `Uploading file ${count_files + 1}/${files.length}`;

            while (start < file.size) {
                const fileBlob = file.slice(start, Math.min(start + chunkSize, file.size));

                let hash = '';
                try {
                    hash = await computeHash(fileBlob);
                } catch (error) {
                    console.error('Error during hash computation:', error);
                    // Continue without hash, or handle as needed
                }

                let retryCount = 0;
                let uploadSuccess = false;

                while (retryCount < maxRetries && !uploadSuccess) {
                    try {
                        const res = await sampleRepository.upload({
                            bearerToken: authStore.getToken ?? '',
                            data: {
                                file: fileBlob,
                                type: 'DATA',
                                file_name: file_name,
                                chunk: 'true',
                                id: id,
                                hash: hash,
                                last: start + chunkSize >= file.size ? 'true' : 'false'
                            },
                            projectId: props.sampleId,
                            organizationId: userStore.getDefaultOrg?.id ?? ''
                        });

                        if (res.status_code != 200) {
                            retryCount++;
                            console.error(
                                `Upload failed for chunk ${id}, attempt ${retryCount}:`,
                                err
                            );
                            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait one second
                            if (retryCount >= maxRetries) {
                                throw new Error(
                                    `Failed to upload chunk ${id} of file ${file_name} after ${maxRetries} attempts: ${err.message}`
                                );
                            }
                        } else {
                            uploadSuccess = true;
                        }
                    } catch (err) {
                        retryCount++;
                        console.error(`Upload failed for chunk ${id}, attempt ${retryCount}:`, err);
                        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait one second
                        if (retryCount >= maxRetries) {
                            throw new Error(
                                `Failed to upload chunk ${id} of file ${file_name} after ${maxRetries} attempts: ${err.message}`
                            );
                        }
                    }
                }

                if (uploadSuccess) {
                    // Update progress to the end of the current chunk
                    progress_preprocess.value =
                        (Math.min(start + chunkSize, file.size) / file.size) * 100;
                    start += chunkSize;
                    id++;
                }
            }

            count_files += 1;

            const createdfile = new ProjectFile();
            createdfile.id = '';
            createdfile.name = file_name;
            createdfile.type = 'DATA';
            createdfile.added_on = new Date();
            files_uploaded.value.push(createdfile);
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait one second
        }

        uploading.value = false;

        if (values.align) {
            toast({
                title: 'File uploaded successfully!',
                description: 'Please wait while we preprocess the file...'
            });
            props.align();
        }
    } catch (error) {
        uploading.value = false;
        toast({
            title: 'Upload failed',
            description: error.message || 'An error occurred during upload.'
        });
        console.error('Upload error:', error);
    }
});
</script>

<template>
    <div v-if="uploading">
        <div>{{ progress_message }}</div>
        <Progress v-model="progress_preprocess"></Progress>
    </div>
    <div v-else class="bg-secondary rounded flex flex-col gap-2 items-center justify-evenly p-2">
        <form class="flex flex-col gap-4 items-start" @submit="onFileSubmit">
            <FormField v-slot="{ componentField }" name="file">
                <FormItem>
                    <FormControl>
                        <input
                            v-bind="componentField"
                            ref="input"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            type="file"
                            multiple
                            accept=".gz, .h5"
                            @input="setSelectionType"
                        />
                    </FormControl>
                    <FormDescription>
                        <span>Upload your gene sequencing file (.h5, .fastq.gz).</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="align">
                <FormItem class="grid grid-cols-4 items-center gap-4">
                    <FormDescription class="col-span-3">
                        Automatically align once file upload is complete
                    </FormDescription>
                    <FormControl>
                        <Switch :model-value="value" @update:model-value="handleChange" />
                    </FormControl>
                </FormItem>
            </FormField>

            <Button type="submit" class="flex gap-2 items-center w-full">
                <Icon icon="bi:cloud-upload"></Icon> Upload
            </Button>
        </form>
    </div>
</template>
