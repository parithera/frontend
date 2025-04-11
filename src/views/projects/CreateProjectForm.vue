<script setup lang="ts">
import { ProjectRepository } from '@/views/projects/project.repository';
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

const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();
const new_project_name: Ref<string> = ref('');
const new_project_description: Ref<string> = ref('');

async function newProject() {
    const res = await projectRepository.createProject({
        bearerToken: authStore.getToken ?? '',
        data: {
            name: new_project_name.value,
            description: new_project_description.value
        },
        orgId: userStore.defaultOrg?.id ?? ''
    });

    router.push({ name: 'results', params: { page: 'results', projectId: res.id } });
}

const submitForm = () => {
    document.getElementById('submitButton')?.click();
};
</script>

<template>
    <Dialog ref="dialog">
        <DialogTrigger as-child>
            <Button class="flex items-center gap-2 rounded-full text-primary" variant="ghost">
                + New analysis
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create a new analysis</DialogTitle>
                <DialogDescription>
                    Name your analysis and give it an optional description.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right"> Name </Label>
                    <Input
                        id="name"
                        v-model="new_project_name"
                        placeholder="Breast cancer"
                        class="col-span-3"
                        @keyup.enter="submitForm"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="description" class="text-right"> Description </Label>
                    <Input
                        id="description"
                        v-model="new_project_description"
                        placeholder="Breast cancer detection project."
                        class="col-span-3"
                        @keyup.enter="submitForm"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button
                        id="submitButton"
                        class="rounded-full"
                        type="submit"
                        @click="newProject"
                    >
                        Create
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
