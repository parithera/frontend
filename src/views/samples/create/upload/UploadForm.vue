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
    for (const file of files) {
        // const type: string = values.type as string;
        let file_name = file.name;

        if (file.name.includes('.h5')) {
            file_name = 'out.h5';
        }

        const chunkSize = 1024 * 1024 * 10; // size of each chunk (10MB)
        let start = 0;
        let id = 0;

        progress_message.value = 'Uploading file ' + count_files + '/' + files.length;
        uploading.value = true;
        while (start < file.size) {
            const fileBlob = file.slice(start, start + chunkSize);

            let hash = '';
            try {
                hash = await computeHash(fileBlob);
                console.log('Computed Hash:', hash);
                // Use `hash` as needed here
            } catch (error) {
                console.error('Error during hash computation:', error);
            }

            await sampleRepository
                .upload({
                    bearerToken: authStore.getToken ?? '',
                    data: {
                        file: fileBlob,
                        type: 'DATA',
                        file_name: file_name,
                        chunk: 'true',
                        id: id,
                        hash: hash,
                        last: 'false'
                    },
                    projectId: props.sampleId,
                    organizationId: userStore.getDefaultOrg?.id ?? ''
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    progress_preprocess.value = (start / file.size) * 100;
                    progress_message.value = 'Uploading file ' + count_files + '/' + files.length;
                    start += chunkSize;
                });
            id++;
        }
        await sampleRepository.upload({
            bearerToken: authStore.getToken ?? '',
            data: {
                file: new Blob(),
                type: 'DATA',
                file_name: file_name,
                chunk: 'true',
                id: id,
                hash: '',
                last: 'true'
            },
            projectId: props.sampleId,
            organizationId: userStore.getDefaultOrg?.id ?? ''
        });
        count_files += 1;

        const createdfile = new ProjectFile();
        createdfile.id = '';
        createdfile.name = file_name;
        createdfile.type = 'DATA';
        createdfile.added_on = new Date();
        files_uploaded.value.push(createdfile);
    }

    uploading.value = false;

    if (values.align) {
        toast({
            title: 'File uploaded successfully!',
            description: 'Please wait while we preprocess the file...'
        });
        props.align();
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
                        <Switch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                </FormItem>
            </FormField>

            <Button type="submit" class="flex gap-2 items-center w-full">
                <Icon icon="bi:cloud-upload"></Icon> Upload
            </Button>
        </form>
    </div>
</template>
