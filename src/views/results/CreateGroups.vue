<script lang="ts" setup>
import type { Project } from '@/repositories/types/entities/Project';
import Button from '@/shadcn/ui/button/Button.vue';
import type { ModelRef, Ref } from 'vue';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shadcn/ui/form'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shadcn/ui/select'

import { toTypedSchema } from '@vee-validate/zod'
import { AutoForm } from '@/shadcn/ui/auto-form'
import { toast } from '@/shadcn/ui/toast'
import { h, ref } from 'vue'
import * as z from 'zod'
import { useForm } from 'vee-validate';
import type { Group } from './types';

// Models
const selected_project: ModelRef<Project> = defineModel('selected_project', { required: true });
const configure_analysis: ModelRef<boolean> = defineModel('configure_analysis', { required: true });
const create_groups: ModelRef<boolean> = defineModel('create_groups', { required: true });
const groups: ModelRef<Array<Group>> = defineModel('groups', { required: true });
const file_type: ModelRef<string> = defineModel('file_type', { required: true });

const group_number: Ref<number> = ref(0)

// Get file names in selected_project.value.files?.name
const files = selected_project.value.files?.map(file => file.name);

type FilesEnumType = { [K in string]: K };

const FileEnum: FilesEnumType = files
    ? Object.fromEntries(files.map(file => [file, file])) as FilesEnumType
    : {} as FilesEnumType;

const schema = z.object({
    groups: z.number().min(1).default(1).describe("How man groups do you want to create?"),
})


function onSubmit(values: Record<string, any>) {
    group_number.value = values.groups

    for (let index = 0; index < values.groups; index++) {
        const group: Group = {
            name: (index + 1).toString(),
            files: []
        }
        groups.value.push(group)
    }

    toast({
        title: 'Group created!'
    })
}


const formSchema = toTypedSchema(z.object({
    // email: z
    //     .string({
    //         required_error: 'Please select an email to display.',
    //     })
    //     .email(),
}).passthrough())

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

const onFormSubmit = handleSubmit((values) => {
    for (let t in values) {
        for (let index = 0; index < groups.value.length; index++) {
            const group = groups.value[index];
            if (group.name == values[t]) {
                if (file_type.value == 'fastq') groups.value[index].files.push(t + '.fastq.gz')
                else groups.value[index].files.push(t + '.h5')
            }
        }
    }
    configure_analysis.value = true
})

function cleanFileName(name: string): string {
    if (name.includes('.fastq.gz')) {
        file_type.value = 'fastq'
        return name.replace('.fastq.gz', '')
    }
    else {
        file_type.value = 'h5'
        return name.replace('.h5', '')
    }
}
</script>
<template>
    <AutoForm class="w-2/3 space-y-6" :schema="schema" @submit="onSubmit">
        <Button type="submit">
            Create
        </Button>
    </AutoForm>

    <form class="w-2/3 space-y-6" @submit="onFormSubmit">
        <FormField v-for="file in selected_project.files" v-slot="{ componentField }" :name="cleanFileName(file.name)">
            <FormItem>
                <FormLabel>{{ file.name }}</FormLabel>

                <Select v-bind="componentField">
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem v-for="group in groups" :key="group.name" :value="group.name">
                                {{ group.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FormDescription>
                    You can manage email addresses in your
                    <a href="/examples/forms">email settings</a>.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit">
            Submit
        </Button>
    </form>

    <Button @click="create_groups = false">Previous</Button>
</template>