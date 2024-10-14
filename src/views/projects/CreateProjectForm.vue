<script setup lang="ts">
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
import { useTemplateRef, type ModelRef } from 'vue';

defineProps<{
    newProject: () => Promise<void>;
}>();

const new_project_name: ModelRef<string> = defineModel('new_project_name', { required: true });
const new_project_description: ModelRef<string> = defineModel('new_project_description', {
    required: true
});

const submitButton = useTemplateRef<HTMLElement>('submitButton');

const submitForm = () => {
    submitButton.value?.click();
};
</script>

<template>
    <Dialog ref="dialog">
        <DialogTrigger as-child>
            <Button class="flex items-center gap-2 rounded-full" variant="outline"
                >+ Create a new project</Button
            >
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create a new project</DialogTitle>
                <DialogDescription>
                    Name your project and give it an optional description.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right"> Name </Label>
                    <Input
                        id="name"
                        placeholder="Breast cancer"
                        class="col-span-3"
                        v-model="new_project_name"
                        @keyup.enter="submitForm"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="description" class="text-right"> Description </Label>
                    <Input
                        id="description"
                        placeholder="Breast cancer detection project."
                        class="col-span-3"
                        v-model="new_project_description"
                        @keyup.enter="submitForm"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button
                        class="rounded-full"
                        id="submitButton"
                        ref="submitButton"
                        @click="newProject"
                        type="submit"
                    >
                        Create
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
