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


const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();
const new_sample_name: Ref<string> = ref('');
const new_sample_comment: Ref<string> = ref('');
const new_sample_condition: Ref<string> = ref('');

const step:Ref<number> = ref(0)
const sample_id:Ref<string> = ref('')

async function newSample() {
    const res = await sampleRepository.createSample({
        bearerToken: authStore.getToken ?? '',
        data: {
            name: new_sample_name.value,
            description: new_sample_comment.value,
            condition: new_sample_condition.value
        },
        orgId: userStore.defaultOrg?.id ?? ''
    });
    step.value++;
    sample_id.value = res.id
}

const submitForm = () => {
    document.getElementById('submitButton')?.click();
};
</script>

<template>
    <Dialog ref="dialog">
        <DialogTrigger as-child>
            <Button class="flex items-center gap-2 rounded-full text-primary" variant="ghost">
                + new sample
            </Button>
        </DialogTrigger>
        <DialogContent v-if="step==0" class="sm:max-w-[425px]">
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
                        placeholder="Sample XYZ"
                        class="col-span-3"
                        v-model="new_sample_name"
                        @keyup.enter="submitForm"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="description" class="text-right"> Comment </Label>
                    <Input
                        id="description"
                        placeholder="Your comment."
                        class="col-span-3"
                        v-model="new_sample_comment"
                        @keyup.enter="submitForm"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="condition" class="text-right"> Condition </Label>
                    <Input
                        id="condition"
                        placeholder="Drug XYZ."
                        class="col-span-3"
                        v-model="new_sample_condition"
                        @keyup.enter="submitForm"
                    />
                </div>
            </div>
            <DialogFooter>

                    <Button
                        class="rounded-full"
                        id="submitButton"
                        @click="newSample"
                        type="submit"
                    >
                        Create
                    </Button>

            </DialogFooter>
        </DialogContent>
        <DialogContent v-else-if="step==1" class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Upload your files</DialogTitle>
                <DialogDescription>
                    Name your sample and give it an optional comment.
                </DialogDescription>
            </DialogHeader>
            <UploadFile :step="step" :sample_id="sample_id"></UploadFile>
            <DialogFooter>

                    <Button
                        class="rounded-full"
                        id="submitButton"
                        @click="newSample"
                        type="submit"
                    >
                        Create
                    </Button>

            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
