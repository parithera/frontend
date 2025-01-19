<script lang="ts" setup>
import type { Project } from '@/repositories/types/entities/Project';
import Button from '@/shadcn/ui/button/Button.vue';
import type { ModelRef } from 'vue';

import { AutoForm } from '@/shadcn/ui/auto-form'
import { toast } from '@/shadcn/ui/toast'
import { h } from 'vue'
import * as z from 'zod'

// Models
const selected_project: ModelRef<Project> = defineModel('selected_project', { required: true });
const configure_analysis: ModelRef<boolean> = defineModel('configure_analysis', { required: true });
const create_groups: ModelRef<boolean> = defineModel('create_groups', { required: true });
const groups: ModelRef<object> = defineModel('groups', { required: true });

function filterName(name: string) {
    return name.replace(".fastq.gz", "")
}

// Get file names in selected_project.value.files?.name
const files = selected_project.value.files?.map(file => file.name);

type FilesEnumType = { [K in string]: K };

const FileEnum: FilesEnumType = files
  ? Object.fromEntries(files.map(file => [file, file])) as FilesEnumType
  : {} as FilesEnumType;

const schema = z.object({
    //   guestListName: z.string(),
    group: z
        .array(
            z.object({
                name: z.string(),
                test: z.nativeEnum(FileEnum)
            }),
        )
        .describe('You can create groups'),
})


function onSubmit(values: Record<string, any>) {
    groups.value = values
    toast({
        title: 'You submitted the following values:',
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    })
    configure_analysis.value = true
}
</script>
<template>
    <div class="flex flex-col gap-2 items-center">
        <span class="font-bold">File uploaded to this project</span>
        <div v-for="file in selected_project.files" :key="file.id"
            class="flex w-full items-center gap-2 justify-between">
            <Icon class="w-1/8" icon="tabler:file"></Icon>
            <span class="w-6/8 text-wrap break-words"> {{ filterName(file.name) }}</span>
        </div>
    </div>

    <AutoForm class="w-2/3 space-y-6" :schema="schema" @submit="onSubmit">
        <div class="flex justify-between">
            <Button @click="create_groups = false">Previous</Button>
            <Button type="submit">
                Next
            </Button>
        </div>
    </AutoForm>
</template>