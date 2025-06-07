<script setup lang="ts">
import { Button } from '@/shadcn/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import DialogFooter from '@/shadcn/ui/dialog/DialogFooter.vue';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { ProjectRepository } from '../../project.repository';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

const props = defineProps<{
    project: {
        id: string;
        name: string;
        description: string;
    };
}>();

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2).max(50).optional(),
        description: z.string().min(2).max(50).optional()
    })
);

async function onSubmit(values: any) {
    try {
        await projectRepository.updateProject({
            orgId: userStore.defaultOrg?.id ?? '',
            projectId: props.project.id,
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            data: {
                name: values.name,
                description: values.description
            }
        });
    } catch (error) {
        console.error(error);
    } finally {
        router.go(0);
    }
}
</script>

<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit analysis</DialogTitle>
                <DialogDescription>
                    Make changes to your analysis here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                :default-value="project.name"
                                placeholder="name"
                                v-bind="componentField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="description">
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                :default-value="project.description"
                                placeholder="description"
                                v-bind="componentField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </form>

            <DialogFooter>
                <Button type="submit" form="dialogForm"> Save changes </Button>
            </DialogFooter>
        </DialogContent>
    </Form>
</template>
