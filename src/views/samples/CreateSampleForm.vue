<script setup lang="ts">
import { SampleRepository } from '@/repositories/SampleRepository';
import router from '@/router';
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
import UploadFile from './UploadFile.vue';
import ConfigureAlignment from './ConfigureAlignment.vue';
import type { ProjectFile } from '@/repositories/types/entities/ProjectFile';


const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();
const new_sample_name: Ref<string> = ref('');
const new_sample_comment: Ref<string> = ref('');
const new_sample_tags: Ref<string> = ref('');

// Refs
const files_uploaded: Ref<Array<ProjectFile>> = ref([])
const step: Ref<number> = ref(0)
const sample_id: Ref<string> = ref('')
const file_type: Ref<string> = ref('')

async function newSample() {
    const res = await sampleRepository.createSample({
        bearerToken: authStore.getToken ?? '',
        data: {
            name: new_sample_name.value,
            description: new_sample_comment.value,
            tags: new_sample_tags.value.replace(" ","").split(',')
        },
        orgId: userStore.defaultOrg?.id ?? ''
    });
    sample_id.value = res.id
    step.value++;
}

const submitForm = () => {
    document.getElementById('submitButton')?.click();
};
</script>

<template>
    <Dialog ref="dialog">
        <DialogTrigger as-child>
            <Button class="flex items-center gap-2 rounded-full text-primary" variant="ghost">
                + New sample
            </Button>
        </DialogTrigger>
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
                    <Input id="name" placeholder="Sample XYZ" class="col-span-3" v-model="new_sample_name"
                        @keyup.enter="submitForm" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="description" class="text-right"> Comment </Label>
                    <Input id="description" placeholder="Your comment." class="col-span-3" v-model="new_sample_comment"
                        @keyup.enter="submitForm" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="tags" class="text-right"> Tags </Label>
                    <Input id="tags" placeholder="Comma, separated, tags" class="col-span-3" v-model="new_sample_tags"
                        @keyup.enter="submitForm" />
                </div>
            </div>
            <DialogFooter>
                <Button class="rounded-full" id="submitButton" @click="newSample" type="submit">
                    Create
                </Button>
            </DialogFooter>
        </DialogContent>
        <DialogContent v-else-if="step == 1" class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Upload your files</DialogTitle>
                <DialogDescription>
                    Import FASTQs or H5 files for this sample.
                </DialogDescription>
            </DialogHeader>
            <UploadFile v-model:file_type="file_type" v-model:sample_id="sample_id" v-model:files_uploaded="files_uploaded"></UploadFile>
            <DialogFooter>

                <Button class="rounded-full" @click="step--">
                    Previous
                </Button>
                <Button v-if="file_type = 'fastq'" class="rounded-full" @click="step++">
                    Next
                </Button>
                <DialogClose v-else as-child>
                    <Button class="rounded-full">
                        Finish
                    </Button>
                </DialogClose>

            </DialogFooter>
        </DialogContent>
        <DialogContent v-else-if="step == 2 && file_type == 'fastq'" class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Configure the alignment</DialogTitle>
                <DialogDescription>
                    Select a Genome and the chemistry.
                </DialogDescription>
            </DialogHeader>
            <ConfigureAlignment v-model:step="step" :sample_id="sample_id" :file_type="file_type" :files_uploaded="files_uploaded"></ConfigureAlignment>
            <DialogFooter>
                <Button class="rounded-full" @click="step--">
                    Previous
                </Button>
                <DialogClose as-child>
                    <Button class="rounded-full" type="submit" form="alignmentForm">
                        Align
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
