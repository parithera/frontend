<script setup lang="ts">
import type { Project } from '@/repositories/types/entities/Project';
import Button from '@/shadcn/ui/button/Button.vue';
import { type ModelRef } from 'vue';
import CreateProjectForm from './CreateProjectForm.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import Card from '@/shadcn/ui/card/Card.vue';
import CardHeader from '@/shadcn/ui/card/CardHeader.vue';
import CardContent from '@/shadcn/ui/card/CardContent.vue';
import CardTitle from '@/shadcn/ui/card/CardTitle.vue';
import CardDescription from '@/shadcn/ui/card/CardDescription.vue';
import CardFooter from '@/shadcn/ui/card/CardFooter.vue';
import Badge from '@/shadcn/ui/badge/Badge.vue';
import Skeleton from '@/shadcn/ui/skeleton/Skeleton.vue';
import Alert from '@/shadcn/ui/alert/Alert.vue';
import { Terminal } from 'lucide-vue-next';
import AlertTitle from '@/shadcn/ui/alert/AlertTitle.vue';
import AlertDescription from '@/shadcn/ui/alert/AlertDescription.vue';

defineProps<{
    selected_project: Project;
    newProject: () => Promise<void>;
    isSelectedProject: (project: Project) => 'default' | 'outline';
    selectOrUnselectProject: (project: Project) => Promise<void>;
    deleteProject: (project: Project) => Promise<void>;
}>();

const new_project_name: ModelRef<string> = defineModel('new_project_name', { required: true });
const new_project_description: ModelRef<string> = defineModel('new_project_description', {
    required: true
});
const projects: ModelRef<Array<Project>> = defineModel('projects', { required: true });
</script>

<template>
    <div v-if="projects.length == 0" class="flex flex-col gap-6 items-center justify-center mt-20">
        <Card class="w-72">
            <CardHeader>
                <CardTitle>No Project found</CardTitle>
                <CardDescription> Please create a new project </CardDescription>
            </CardHeader>
            <CardContent class="grow flex flex-col gap-2">
                <span class="flex gap-2">
                    <Skeleton class="w-12 h-6"></Skeleton>
                    <Skeleton class="w-12 h-6"></Skeleton>
                </span>
                <Skeleton class="w-40 h-6"></Skeleton>
                <Skeleton class="w-40 h-6"></Skeleton>
                <Skeleton class="self-center w-48 h-24"></Skeleton>
            </CardContent>
            <CardFooter class="flex gap-4 justify-center">
                <CreateProjectForm
                    v-model:new_project_name="new_project_name"
                    v-model:new_project_description="new_project_description"
                    :newProject="newProject"
                />
            </CardFooter>
        </Card>
    </div>
    <div v-else class="flex flex-col gap-6 items-center justify-center mt-20">
        <Alert class="w-1/2">
            <Terminal class="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                Please select a project from the list or create a new one.
            </AlertDescription>
        </Alert>
        <div class="flex flex-wrap items-strech gap-4">
            <Card class="w-72" v-for="project in projects" :key="project.id">
                <CardHeader>
                    <CardTitle>{{ project.name }}</CardTitle>
                    <CardDescription>
                        {{ project.description }}
                    </CardDescription>
                </CardHeader>
                <CardContent class="grow flex flex-col">
                    <span class="flex gap-2">
                        <Badge v-for="(file, index) in project.files" :key="file.id" class="w-fit"
                            >Analysis n°{{ index + 1 }}</Badge
                        >
                        <Badge v-if="!project.files || project.files.length == 0" class="w-fit"
                            >no analysis done yet</Badge
                        >
                    </span>
                    <span> Patient ID : n°xyz123 </span>
                    <span> Patient Info : xyz </span>
                    <span>
                        <svg
                            width="242px"
                            height="140px"
                            x="0px"
                            y="0px"
                            viewBox="0 0 242 140"
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            style="transform: translate(0, 0)"
                        >
                            <rect x="0" y="0" width="242" height="140" style="fill: #ffffff" />
                            <g transform="translate(10, 10)" style="fill: #000000">
                                <text
                                    style="font: bold 20px monospace"
                                    text-anchor="start"
                                    x="0"
                                    y="120"
                                >
                                    1
                                </text>
                            </g>
                            <g transform="translate(26, 10)" style="fill: #000000">
                                <rect x="0" y="0" width="2" height="110" />
                                <rect x="4" y="0" width="2" height="110" />
                                <rect x="10" y="0" width="4" height="110" />
                                <rect x="18" y="0" width="2" height="110" />
                                <text
                                    style="font: bold 20px monospace"
                                    text-anchor="middle"
                                    x="10"
                                    y="130"
                                />
                            </g>
                            <g transform="translate(46, 10)" style="fill: #000000">
                                <rect x="4" y="0" width="2" height="100" />
                                <rect x="10" y="0" width="4" height="100" />
                                <rect x="16" y="0" width="8" height="100" />
                                <rect x="26" y="0" width="2" height="100" />
                                <rect x="30" y="0" width="2" height="100" />
                                <rect x="38" y="0" width="4" height="100" />
                                <rect x="44" y="0" width="4" height="100" />
                                <rect x="54" y="0" width="2" height="100" />
                                <rect x="58" y="0" width="2" height="100" />
                                <rect x="62" y="0" width="8" height="100" />
                                <text
                                    style="font: bold 20px monospace"
                                    text-anchor="middle"
                                    x="35"
                                    y="120"
                                >
                                    23456
                                </text>
                            </g>
                            <g transform="translate(116, 10)" style="fill: #000000">
                                <rect x="2" y="0" width="2" height="110" />
                                <rect x="6" y="0" width="2" height="110" />
                                <text
                                    style="font: bold 20px monospace"
                                    text-anchor="middle"
                                    x="5"
                                    y="130"
                                />
                            </g>
                            <g transform="translate(126, 10)" style="fill: #000000">
                                <rect x="0" y="0" width="2" height="100" />
                                <rect x="8" y="0" width="2" height="100" />
                                <rect x="14" y="0" width="2" height="100" />
                                <rect x="20" y="0" width="2" height="100" />
                                <rect x="28" y="0" width="6" height="100" />
                                <rect x="36" y="0" width="2" height="100" />
                                <rect x="42" y="0" width="6" height="100" />
                                <rect x="52" y="0" width="2" height="100" />
                                <rect x="56" y="0" width="4" height="100" />
                                <rect x="64" y="0" width="4" height="100" />
                                <text
                                    style="font: bold 20px monospace"
                                    text-anchor="middle"
                                    x="35"
                                    y="120"
                                >
                                    78901
                                </text>
                            </g>
                            <g transform="translate(196, 10)" style="fill: #000000">
                                <rect x="0" y="0" width="4" height="110" />
                                <rect x="6" y="0" width="4" height="110" />
                                <rect x="14" y="0" width="2" height="110" />
                                <rect x="18" y="0" width="2" height="110" />
                                <text
                                    style="font: bold 20px monospace"
                                    text-anchor="middle"
                                    x="10"
                                    y="130"
                                />
                            </g>
                            <g transform="translate(216, 10)" style="fill: #000000">
                                <text
                                    style="font: bold 20px monospace"
                                    text-anchor="end"
                                    x="15"
                                    y="120"
                                >
                                    2
                                </text>
                            </g>
                        </svg>
                    </span>
                </CardContent>
                <CardFooter class="flex justify-between px-6 pb-6">
                    <Button
                        class="rounded-full"
                        variant="outline"
                        @click="selectOrUnselectProject(project)"
                    >
                        Open
                    </Button>
                    <Button
                        class="flex gap-2 rounded-full"
                        variant="destructive"
                        @click="deleteProject(project)"
                    >
                        <Icon icon="iconoir:trash"></Icon> Remove
                    </Button>
                </CardFooter>
            </Card>
            <Card class="w-72">
                <CardHeader>
                    <CardTitle><Skeleton class="w-20 h-6"></Skeleton></CardTitle>
                    <CardDescription> <Skeleton class="w-40 h-6"></Skeleton> </CardDescription>
                </CardHeader>
                <CardContent class="grow flex flex-col gap-2">
                    <span class="flex gap-2">
                        <Skeleton class="w-12 h-6"></Skeleton>
                        <Skeleton class="w-12 h-6"></Skeleton>
                    </span>
                    <Skeleton class="w-40 h-6"></Skeleton>
                    <Skeleton class="w-40 h-6"></Skeleton>
                    <Skeleton class="self-center w-48 h-24"></Skeleton>
                </CardContent>
                <CardFooter class="flex gap-4 justify-center">
                    <CreateProjectForm
                        v-model:new_project_name="new_project_name"
                        v-model:new_project_description="new_project_description"
                        :newProject="newProject"
                    />
                </CardFooter>
            </Card>
        </div>
    </div>
</template>
