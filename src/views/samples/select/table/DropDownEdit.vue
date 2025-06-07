<script setup lang="ts">
import { Button } from '@/shadcn/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import DialogFooter from '@/shadcn/ui/dialog/DialogFooter.vue';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { SampleRepository } from '../../sample.repository';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

const props = defineProps<{
    sample: {
        id: string;
        name: string;
        description: string;
        type: string;
        tags: string[];
    };
}>();

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2).max(50).optional(),
        description: z.string().min(2).max(50).optional(),
        tags: z.string().max(50).optional()
    })
);

async function onSubmit(values: any) {
    console.error(values);

    try {
        await sampleRepository.updateSample({
            orgId: userStore.defaultOrg?.id ?? '',
            sampleId: props.sample.id,
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            data: {
                name: values.name ?? props.sample.name,
                description: values.description ?? props.sample.description,
                tags: values.tags ? values.tags.replace(' ', '').split(',') : props.sample.tags,
                type: props.sample.type
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
                <DialogTitle>Edit sample</DialogTitle>
                <DialogDescription>
                    Make changes to your sample here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                :default-value="sample.name"
                                placeholder="name"
                                v-bind="componentField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="comment">
                    <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                :default-value="sample.description"
                                placeholder="comment"
                                v-bind="componentField"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="tags">
                    <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                :default-value="sample.tags.join(',')"
                                placeholder="Comma, separated, tags"
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
