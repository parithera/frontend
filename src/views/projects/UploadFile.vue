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
import FormLabel from '@/shadcn/ui/form/FormLabel.vue';
import FormMessage from '@/shadcn/ui/form/FormMessage.vue';
import Progress from '@/shadcn/ui/progress/Progress.vue';
import Select from '@/shadcn/ui/select/Select.vue';
import SelectContent from '@/shadcn/ui/select/SelectContent.vue';
import SelectGroup from '@/shadcn/ui/select/SelectGroup.vue';
import SelectItem from '@/shadcn/ui/select/SelectItem.vue';
import SelectTrigger from '@/shadcn/ui/select/SelectTrigger.vue';
import SelectValue from '@/shadcn/ui/select/SelectValue.vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import { useToast } from '@/shadcn/ui/toast';
import Toaster from '@/shadcn/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { computeHash } from '@/utils/crypto';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useForm } from 'vee-validate';
import { ref, useTemplateRef, type ModelRef, type Ref } from 'vue';

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

// Refs
const progress_message: Ref<string> = ref("Uploading")
const progress_preprocess: Ref<number> = ref(0)
const uploading: Ref<boolean> = ref(false)
const input = useTemplateRef('input')
const selection_type: Ref<string> = ref("fastq")

const { toast } = useToast();

const { handleSubmit } = useForm({
    // validationSchema: formSchema
});

const onFileSubmit = handleSubmit(async (values) => {
    const files: Array<File> = values.file as Array<File>;

    let chemistry: string = "";
    let genome: string = "";
    let platform: string = "";
        
    if (files[0].name.includes(".fastq.gz")) {
        chemistry = values.chemistry as string;
        genome = values.genome as string;
        platform = chemistry.includes("10x") ? "10x": "hydrop";
    }

    let analyzer_name = 'fastq_initialization';
    let count_files = 0
    let file_type = "fastq"
    for (const file of files) {
        // const type: string = values.type as string;
        let file_name = file.name;

        if (file.name.includes('.h5')) {
            file_name = 'data.h5';
            analyzer_name = 'h5_initialization';
            file_type = "h5"
        }
        
        const chunkSize = 1024 * 1024 * 10; // size of each chunk (10MB)
        let start = 0;
        let id = 0;

        progress_message.value = "Uploading file " + count_files + "/" + files.length
        uploading.value = true
        while (start < file.size) {
            const fileBlob = file.slice(start, start + chunkSize)

            let hash = ""
            try {
                hash = await computeHash(fileBlob);
                console.log('Computed Hash:', hash);
                // Use `hash` as needed here
            } catch (error) {
                console.error('Error during hash computation:', error);
            }

            await fileRepository.upload({
                bearerToken: authStore.getToken ?? '',
                data: {
                    file: fileBlob,
                    type: 'DATA',
                    file_name: file_name,
                    chunk: "true",
                    id: id,
                    hash: hash,
                    last: "false"
                },
                projectId: selected_project.value.id,
                organizationId: userStore.getDefaultOrg?.id ?? ''
            }).catch(err => {
                console.error(err);
            })
            .finally(()=>{
                progress_preprocess.value = start/file.size * 100
                progress_message.value = "Uploading file " + count_files + "/"+files.length
                start += chunkSize;
            });
            id ++;
        }
        await fileRepository.upload({
            bearerToken: authStore.getToken ?? '',
            data: {
                file: new Blob(),
                type: 'DATA',
                file_name: file_name,
                chunk: "true",
                id: id,
                hash: "",
                last: "true"
            },
            projectId: selected_project.value.id,
            organizationId: userStore.getDefaultOrg?.id ?? ''
        })
        count_files += 1;
    }

    toast({
        title: 'File uploaded successfully!',
        description: 'Please wait while we preprocess the file...'
    });

    loading.value = true;

    const analyzer = await analyzerRepository.getAnalyzerByName({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        analyzer_name: analyzer_name
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
                    type: analyzer_name
                },
                fastqc: {
                    project: selected_project.value.id,
                    user: selected_project.value.added_by?.id
                },
                star: {
                    project: selected_project.value.id,
                    user: selected_project.value.added_by?.id,
                    genome: genome,
                    whitelist: chemistry,
                    platform: platform
                },
                scanpy: {
                    project: selected_project.value.id,
                    user: selected_project.value.added_by?.id,
                    file_type: file_type
                },
                fastp: {
                    platform: platform,
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

function filterName(name:string) {
    return name.replace(".fastq.gz", "")
}

function setSelectionType() {
    selection_type.value = input.value?.value.includes('fastq') ? "fastq" : "h5"
}

</script>

<template>
    <div v-if="uploading">
        <div>{{ progress_message }}</div>
        <Progress v-model="progress_preprocess"></Progress>
    </div>
    <div
        v-else-if="!selected_project.files || selected_project.files.length == 0"
        class="bg-secondary rounded flex justify-evenly p-2"
    >
        <form class="flex flex-col gap-2 items-start" @submit="onFileSubmit">
            <FormField v-slot="{ componentField }" name="file">
                <FormItem>
                    <FormControl>
                        <input
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            type="file"
                            multiple
                            accept=".gz, .h5"
                            v-bind="componentField"
                            ref="input"
                            @input="setSelectionType"
                        />
                    </FormControl>
                    <FormDescription>
                        <span>Upload your gene sequencing file (.h5, .fastq.gz).</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-if="selection_type == 'fastq'" v-slot="{ componentField }" name="chemistry">
                <FormItem>
                    <FormLabel>Chemistry</FormLabel>

                    <Select v-bind="componentField">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the relevant chemistry" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <!-- https://kb.10xgenomics.com/hc/en-us/articles/115004506263-What-is-a-barcode-whitelist -->
                            <SelectGroup>
                                <SelectItem value="hydrop">
                                    HyDrop
                                </SelectItem>
                                <Separator></Separator>
                                <SelectItem value="10x-2014">
                                    Single Cell 3' v1 (2014)
                                </SelectItem>
                                <SelectItem value="10x-2016">
                                    Single Cell 3' v2, Single Cell 5' v1 and v2, Single Cell 5' HT v2 (2016)
                                </SelectItem>
                                <SelectItem value="10x-2018">
                                    Single Cell 3' v3, Single Cell 3' v3.1, Single Cell 3' HT v3.1 (2018)
                                </SelectItem>
                                <SelectItem value="10x-2023">
                                    Single Cell 5' v3 (2023)
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-if="selection_type == 'fastq'" v-slot="{ componentField }" name="genome">
                <FormItem>
                    <FormLabel>Genome</FormLabel>

                    <Select v-bind="componentField">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the relevant genome" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="gencodegenes_GRCm39_mouse">
                                    Mouse GRCm39 GencodeGenes
                                </SelectItem>
                                <SelectItem value="nih_GRCm39_mouse">
                                    Mouse GRCm39 NIH
                                </SelectItem>
                                <Separator></Separator>
                                <SelectItem value="nih_GRCh38_human">
                                    Human GRCh38 NIH (Recommended)
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
            <span class="w-6/8 text-wrap break-words"> {{ filterName(file.name) }}</span
            ><Icon
                class="cursor-pointer w-1/8 text-destructive"
                icon="iconoir:trash"
                @click="deleteFile(file)"
            ></Icon>
        </div>
    </div>
    <Toaster />
</template>
