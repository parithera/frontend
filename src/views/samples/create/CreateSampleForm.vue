<script setup lang="ts">
import { SampleRepository } from '@/views/samples/sample.repository';
import Button from '@/shadcn/ui/button/Button.vue';
import Dialog from '@/shadcn/ui/dialog/Dialog.vue';
import DialogClose from '@/shadcn/ui/dialog/DialogClose.vue';
import DialogContent from '@/shadcn/ui/dialog/DialogContent.vue';
import DialogDescription from '@/shadcn/ui/dialog/DialogDescription.vue';
import DialogFooter from '@/shadcn/ui/dialog/DialogFooter.vue';
import DialogHeader from '@/shadcn/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/shadcn/ui/dialog/DialogTitle.vue';
import DialogTrigger from '@/shadcn/ui/dialog/DialogTrigger.vue';
import Input from '@/shadcn/ui/input/Input.vue';
import Label from '@/shadcn/ui/label/Label.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { ref, type Ref } from 'vue';
import UploadFile from './upload/UploadFile.vue';
import Switch from '@/shadcn/ui/switch/Switch.vue';
import Select from '@/shadcn/ui/select/Select.vue';
import SelectTrigger from '@/shadcn/ui/select/SelectTrigger.vue';
import SelectValue from '@/shadcn/ui/select/SelectValue.vue';
import SelectContent from '@/shadcn/ui/select/SelectContent.vue';
import SelectGroup from '@/shadcn/ui/select/SelectGroup.vue';
import SelectItem from '@/shadcn/ui/select/SelectItem.vue';
import router from '@/router';
import type { Group } from '../types';
import type { ProjectFile } from '@/views/projects/project_file.entity';
import { AnalyzerRepository } from '@/views/analyzers/analyzer.repository';
import Separator from '@/shadcn/ui/separator/Separator.vue';

const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();
const analyzerRepository: AnalyzerRepository = new AnalyzerRepository();
const new_sample_name: Ref<string> = ref('');
const new_sample_comment: Ref<string> = ref('');
const new_sample_tags: Ref<string> = ref('');
const chemistry: Ref<string> = ref('');
const genome: Ref<string> = ref('');

// Refs
const step: Ref<number> = ref(0);
const sample_id: Ref<string> = ref('');
const fastq: Ref<boolean> = ref(true);
const files_uploaded: Ref<Array<ProjectFile>> = ref([]);

async function newSample() {
    const res = await sampleRepository.createSample({
        bearerToken: authStore.getToken ?? '',
        data: {
            name: new_sample_name.value,
            description: new_sample_comment.value,
            tags: new_sample_tags.value.replace(' ', '').split(',')
        },
        orgId: userStore.defaultOrg?.id ?? ''
    });
    sample_id.value = res.id;
    step.value++;
}

async function align() {
    let platform: string = '';

    if (fastq.value) {
        platform = chemistry.value.includes('10x') ? '10x' : 'hydrop';
    }

    let analyzer_name = 'fastq_initialization';
    if (!fastq.value) {
        analyzer_name = 'h5_initialization';
    }

    const analyzer = await analyzerRepository.getAnalyzerByName({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        analyzer_name: analyzer_name
    });

    const files = [];
    for (const file of files_uploaded.value) {
        files.push(file.name);
    }

    const group: Group = {
        name: 'group',
        files: files
    };
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
                    sample: sample_id.value
                },
                star: {
                    sample: sample_id.value,
                    genome: genome.value,
                    whitelist: chemistry.value,
                    platform: platform,
                    groups: [group]
                },
                scanpy: {
                    sample: sample_id.value,
                    file_type: fastq.value ? 'fastq' : 'h5'
                },
                fastp: {
                    platform: platform,
                    sample: sample_id.value
                }
            },
            branch: ' ', // This will be removed
            commit_hash: ' ' // This will be removed
        }
    });

    router.go(0);
}
</script>

<template>
    <Dialog ref="dialog">
        <DialogTrigger as-child>
            <Button class="flex items-center gap-2 rounded-full text-primary" variant="ghost">
                + New sample
            </Button>
        </DialogTrigger>

        <!-- SAMPLE CREATION FORM -->
        <DialogContent v-if="step == 0" class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add a new sample</DialogTitle>
                <DialogDescription>
                    Name your sample and give it an optional comment.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right"> Name </Label>
                    <Input
                        id="name"
                        v-model="new_sample_name"
                        placeholder="Sample XYZ"
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="description" class="text-right"> Comment </Label>
                    <Input
                        id="description"
                        v-model="new_sample_comment"
                        placeholder="Your comment."
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="tags" class="text-right"> Tags </Label>
                    <Input
                        id="tags"
                        v-model="new_sample_tags"
                        placeholder="Comma, separated, tags"
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="file-type" class="text-right">File Type</Label>
                    <div class="flex gap-2 items-center justify-center text-xs col-span-3">
                        <span>H5</span>
                        <Switch
                            id="file-type"
                            class="col-span-2"
                            :model-value="fastq"
                            @update:model-value="fastq = !fastq"
                        />
                        <span>FASTQ</span>
                    </div>
                </div>
                <div v-if="fastq">
                    <Label for="file-type" class="text-right">Select Chemistry</Label>
                    <Select v-model="chemistry" class="col-span-3">
                        <SelectTrigger>
                            <SelectValue placeholder="Select the relevant chemistry" />
                        </SelectTrigger>
                        <SelectContent>
                            <!-- https://kb.10xgenomics.com/hc/en-us/articles/115004506263-What-is-a-barcode-whitelist -->
                            <SelectGroup>
                                <SelectItem value="hydrop"> HyDrop </SelectItem>
                                <Separator></Separator>
                                <SelectItem value="10x-3p-v1">
                                    Single Cell 3' v1 (2014)
                                </SelectItem>
                                <SelectItem value="10x-3p-v2">
                                    Single Cell 3' v2 (2016)
                                </SelectItem>
                                <SelectItem value="10x-3p-v3">
                                    Single Cell 3' v3, Single Cell 3' v3.1 (2018)
                                </SelectItem>
                                <SelectItem value="10x-5p">
                                    Single Cell 5' v1 and v2 (2016)
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div v-if="fastq">
                    <Label for="file-type" class="text-right">Select Genome</Label>
                    <Select v-model="genome">
                        <SelectTrigger>
                            <SelectValue placeholder="Select the relevant genome" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <!-- <SelectItem value="gencodegenes_GRCm39_mouse">
                                    Mouse GRCm39 GencodeGenes
                                </SelectItem>
                                <SelectItem value="nih_GRCm39_mouse">
                                    Mouse GRCm39 NIH
                                </SelectItem>
                                <Separator></Separator> -->
                                <SelectItem value="10x_GRCh38_human">
                                    Human GRCh38 10x (Recommended)
                                </SelectItem>
                                <SelectItem value="nih_GRCh38_human"> Human GRCh38 NIH </SelectItem>
                                <SelectItem value="gencodegenes_GRCh38_human">
                                    Human GRCh38 GencodeGenes
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button id="submitButton" class="rounded-full" type="submit" @click="newSample">
                    Create
                </Button>
            </DialogFooter>
        </DialogContent>

        <!-- FILE UPLOAD FORM -->
        <DialogContent v-else-if="step == 1" class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Upload your files</DialogTitle>
                <DialogDescription> Import FASTQs or H5 files for this sample. </DialogDescription>
            </DialogHeader>
            <UploadFile
                v-model:files-uploaded="files_uploaded"
                :sample-id="sample_id"
                :align="align"
            />
            <DialogFooter>
                <Button class="rounded-full" @click="step--"> Previous </Button>
                <DialogClose as-child>
                    <Button v-if="fastq" class="rounded-full" @click="align"> Align </Button>
                    <Button v-else class="rounded-full"> Close </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
