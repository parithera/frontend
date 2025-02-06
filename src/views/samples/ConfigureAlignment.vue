<script lang="ts" setup>
import { AnalyzerRepository } from '@/repositories/AnalyzerRepository';
import Button from '@/shadcn/ui/button/Button.vue';
import { FormField } from '@/shadcn/ui/form';
import FormControl from '@/shadcn/ui/form/FormControl.vue';
import FormItem from '@/shadcn/ui/form/FormItem.vue';
import FormLabel from '@/shadcn/ui/form/FormLabel.vue';
import FormMessage from '@/shadcn/ui/form/FormMessage.vue';
import Select from '@/shadcn/ui/select/Select.vue';
import SelectContent from '@/shadcn/ui/select/SelectContent.vue';
import SelectGroup from '@/shadcn/ui/select/SelectGroup.vue';
import SelectItem from '@/shadcn/ui/select/SelectItem.vue';
import SelectTrigger from '@/shadcn/ui/select/SelectTrigger.vue';
import SelectValue from '@/shadcn/ui/select/SelectValue.vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useForm } from 'vee-validate';
import type { ModelRef } from 'vue';
import type { Group } from './types';
import { SampleRepository } from '@/repositories/SampleRepository';
import type { ProjectFile } from '@/repositories/types/entities/ProjectFile';

const props = defineProps<{
    file_type: string;
    sample_id: string;
    files_uploaded: Array<ProjectFile>;
}>();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();
const analyzerRepository: AnalyzerRepository = new AnalyzerRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Models
const step: ModelRef<number> = defineModel('step', { required: true });
const sample_id: ModelRef<string> = defineModel('sample_id', { required: true });

const { handleSubmit } = useForm({
    // validationSchema: formSchema
});

const onFileSubmit = handleSubmit(async (values) => {
    let chemistry: string = "";
    let genome: string = "";
    let platform: string = "";
    
    if (props.file_type == 'fastq') {
        chemistry = values.chemistry as string;
        genome = values.genome as string;
        platform = chemistry.includes("10x") ? "10x" : "hydrop";
    }

    let analyzer_name = 'fastq_initialization';
    if (props.file_type == 'h5') {
        analyzer_name = 'h5_initialization';
    }

    const analyzer = await analyzerRepository.getAnalyzerByName({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        analyzer_name: analyzer_name
    });

    let files = [];
    for (const file of props.files_uploaded){
        files.push(file.name)
    }

    const group:Group = {
        name: "group",
        files: files
    }
    await sampleRepository.createAnalysis({
        orgId: userStore.defaultOrg?.id ?? '',
        sampleId: sample_id.value,
        bearerToken: authStore.getToken ?? '',
        handleBusinessErrors: true,
        data: {
            analyzer_id: analyzer.data.id,
            config: {
                r: {
                    sample: sample_id.value,
                    type: analyzer_name
                },
                fastqc: {
                    sample: sample_id.value,
                },
                star: {
                    sample: sample_id.value,
                    genome: genome,
                    whitelist: chemistry,
                    platform: platform,
                    groups: [group]
                },
                scanpy: {
                    sample: sample_id.value,
                    file_type: props.file_type
                },
                fastp: {
                    platform: platform,
                    sample: sample_id.value,
                },
            },
            branch: ' ', // This will be removed
            commit_hash: ' ' // This will be removed
        }
    });
});
</script>
<template>
    You need to configure the analysis
    <form id="alignmentForm" class="flex flex-col gap-2 items-start" @submit="onFileSubmit">
        <FormField v-if="file_type == 'fastq'" v-slot="{ componentField }" name="chemistry">
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
                            <!-- <SelectItem value="10x-2014">
                                Single Cell 3' v1 (2014)
                            </SelectItem> -->
                            <SelectItem value="10x-2016">
                                Single Cell 3' v2, Single Cell 5' v1 and v2, Single Cell 5' HT v2 (2016)
                            </SelectItem>
                            <!-- <SelectItem value="10x-2018">
                                Single Cell 3' v3, Single Cell 3' v3.1, Single Cell 3' HT v3.1 (2018)
                            </SelectItem> -->
                            <SelectItem value="10x-2023">
                                Single Cell 5' v3 (2023)
                            </SelectItem>
                            <!-- <SelectItem value="10x-2023-may">
                                Single Cell 3' v4 (2023 May)
                            </SelectItem> -->
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-if="file_type == 'fastq'" v-slot="{ componentField }" name="genome">
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
                            <SelectItem value="10x_GRCh38_human">
                                Human GRCh38 10x (Recommended)
                            </SelectItem>
                            <SelectItem value="nih_GRCh38_human">
                                Human GRCh38 NIH
                            </SelectItem>
                            <SelectItem value="gencodegenes_GRCh38_human">
                                Human GRCh38 GencodeGenes
                            </SelectItem>

                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        </FormField>
    </form>

</template>