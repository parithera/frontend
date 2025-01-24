<script lang="ts" setup>
import type { Project } from '@/repositories/types/entities/Project';
import Button from '@/shadcn/ui/button/Button.vue';
import type { ModelRef } from 'vue';
import { AutoForm } from '@/shadcn/ui/auto-form'
import {  onMounted } from 'vue'
import * as z from 'zod'
import type { Group } from './types';
import Card from '@/shadcn/ui/card/Card.vue';
import CardHeader from '@/shadcn/ui/card/CardHeader.vue';
import CardTitle from '@/shadcn/ui/card/CardTitle.vue';
import CardContent from '@/shadcn/ui/card/CardContent.vue';
import CardFooter from '@/shadcn/ui/card/CardFooter.vue';
import { Icon } from '@iconify/vue';
import Checkbox from '@/shadcn/ui/checkbox/Checkbox.vue';
import Popover from '@/shadcn/ui/popover/Popover.vue';
import PopoverTrigger from '@/shadcn/ui/popover/PopoverTrigger.vue';
import PopoverContent from '@/shadcn/ui/popover/PopoverContent.vue';
import AutoFormField from '@/shadcn/ui/auto-form/AutoFormField.vue';


// Models
const selected_project: ModelRef<Project> = defineModel('selected_project', { required: true });
const configure_analysis: ModelRef<boolean> = defineModel('configure_analysis', { required: true });
const create_groups: ModelRef<boolean> = defineModel('create_groups', { required: true });
const groups: ModelRef<Array<Group>> = defineModel('groups', { required: true });
const file_type: ModelRef<string> = defineModel('file_type', { required: true });

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

function addGroup() {
    const group: Group = {
        name: "Group_" + groups.value.length,
        files: []
    }
    groups.value.push(group)
}

function updateGroupName(values: Record<string, any>, index: number) {
    groups.value[index].name = values.name.replace(" ", "_")
}

function deleteGroup(index: number) {
    groups.value.splice(index, 1)
}

function addRemoveFileFromGroup(fileName:string, index: number) {
    if (groups.value[index].files.includes(fileName)) {
        const indexToRemove = groups.value[index].files.indexOf(fileName)
        groups.value[index].files.splice(indexToRemove, 1)
    }else{
        groups.value[index].files.push(fileName)
    }
}

const groupSchema = z.object({
    name: z.string(),
})

onMounted(() => {
    if (groups.value.length == 0) {
        addGroup()
    }
})
</script>
<template>
    <div class="flex flex-col items-center gap-4 w-full">
        <div class="flex gap-2 flex-wrap">
            <Card v-for="(group, index) in groups" :key="group.name">
                <CardHeader>
                    <CardTitle class="flex gap-2">
                        <Popover>
                            <PopoverTrigger as-child>
                                <div class="cursor-pointer flex gap-2">
                                    {{ group.name }}
                                    <Icon icon="material-symbols:edit"></Icon>
                                </div>

                            </PopoverTrigger>
                            <PopoverContent class="w-80">
                                <AutoForm class="w-2/3 space-y-6" :schema="groupSchema" :field-config="{
                                    name: {
                                        hideLabel: true,
                                    },
                                }" @submit="(payload) => { updateGroupName(payload, index) }">
                                    <template #name="slotProps">
                                        <div class="flex items-start gap-3">
                                            <div class="flex-1">
                                                <AutoFormField v-bind="slotProps" />
                                            </div>
                                            <div>
                                                <Button type="submit">
                                                    Update
                                                </Button>
                                            </div>
                                        </div>
                                    </template>
                                </AutoForm>
                            </PopoverContent>
                        </Popover>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flex gap-2 items-center" id="files" v-for="file in selected_project.files"
                        :key="file.name">
                        <Checkbox @click="addRemoveFileFromGroup(file.name, index)"></Checkbox>
                        <div>{{ cleanFileName(file.name) }}</div>
                    </div>
                </CardContent>
                <CardFooter><Button @click="deleteGroup(index)" variant="destructive">Delete</Button></CardFooter>
            </Card>
            <div @click="addGroup" class="rounded-full px-2 py-1 h-fit w-fit bg-gray-100 cursor-pointer">+ Add group
            </div>
        </div>
        <div class="flex justify-between w-1/2">
            <Button @click="create_groups = false">Previous</Button>
            <Button @click="configure_analysis = true">Next</Button>
        </div>

    </div>
</template>