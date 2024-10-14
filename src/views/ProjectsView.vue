<script lang="ts" setup>
import { Button } from '@/shadcn/ui/button';

import { useStateStore } from '@/stores/state';
import { useAuthStore } from '@/stores/auth';

import { Icon } from '@iconify/vue/dist/iconify.js';
import { onMounted, ref, type Ref } from 'vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { useUserStore } from '@/stores/user';
import { Project } from '@/repositories/types/entities/Project';
import Skeleton from '@/shadcn/ui/skeleton/Skeleton.vue';
import Avatar from '@/shadcn/ui/avatar/Avatar.vue';
import AvatarImage from '@/shadcn/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/shadcn/ui/avatar/AvatarFallback.vue';
import VueMarkdown from 'vue-markdown-render';
import ResizablePanelGroup from '@/shadcn/ui/resizable/ResizablePanelGroup.vue';
import { ResizablePanel } from '@/shadcn/ui/resizable';
import ResizableHandle from '@/shadcn/ui/resizable/ResizableHandle.vue';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';
import Quill, { type QuillOptions } from 'quill';
import { useTemplateRef } from 'vue';
import SelectProject from '@/views/projects/SelectProject.vue';
import CreateProjectForm from '@/views/projects/CreateProjectForm.vue';
import UploadFile from '@/views/projects/UploadFile.vue';
import RequestBar from '@/views/projects/RequestBar.vue';
import PreProcessData from '@/views/projects/PreProcessData.vue';

const state = useStateStore();
state.$reset();
state.page = 'dashboard';

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

export type ChatContent = {
    request: string;
    response: string;
};

let chat_content: Ref<ChatContent[]> = ref([
    {
        request: '',
        response: 'Hi, how can I help you today?'
    }
]);

const new_project_name = ref('');
const new_project_description = ref('');
const projects: Ref<Array<Project>> = ref(new Array<Project>());
const selected_project: Ref<Project> = ref(new Project());
const svg_elbow = ref('');
const svg_umap = ref('');
const svg_variable_features = ref('');
const svg_violin = ref('');
const svg_graph = ref('');
const loading = ref(false);
const isOpen = ref(false);

const editor = useTemplateRef<HTMLDivElement>('editor');

async function newProject() {
    chat_content.value = [
        {
            request: '',
            response: 'Hi, how can I help you today?'
        }
    ];

    const res = await projectRepository.createProject({
        bearerToken: authStore.getToken ?? '',
        data: {
            name: new_project_name.value,
            description: new_project_description.value
        },
        orgId: userStore.defaultOrg?.id ?? ''
    });
    await getProjects();

    selected_project.value =
        projects.value.find((project) => project.id === res.id) ?? new Project();
}

async function deleteProject(project: Project) {
    await projectRepository.deleteProject({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });
    await getProjects();
    if (selected_project.value.id === project.id) {
        selected_project.value = new Project();
    }
}

async function getProjects() {
    const projects_retrieved = await projectRepository.getProjects({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        pagination: {
            page: 0,
            entries_per_page: 0
        },
        search: {
            searchKey: ''
        },
        sort: {
            sortKey: '',
            sortDirection: undefined
        }
    });

    projects.value = projects_retrieved.data;
}

function isSelectedProject(project: Project) {
    if (selected_project.value.name == project.name) {
        return 'default';
    }
    return 'outline';
}

async function selectOrUnselectProject(project: Project) {
    svg_elbow.value = '';
    svg_umap.value = '';
    svg_variable_features.value = '';
    svg_violin.value = '';
    if (selected_project.value.name == project.name) {
        selected_project.value = new Project();
    } else {
        const project_retrieved = await projectRepository.getProjectById({
            bearerToken: authStore.getToken ?? '',
            projectId: project.id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
        selected_project.value = project_retrieved.data;

        if (selected_project.value.files) {
            const files = selected_project.value.files;
            if (files.length == 0) {
                loading.value = false;
                return;
            }
        }
        fetchGraphs(project);
    }
}

async function fetchGraphs(project: Project) {
    const elbow = await projectRepository.getSVGElbow({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_elbow.value = elbow.data;

    const umap = await projectRepository.getSVGUMAP({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_umap.value = umap.data;

    const variable_features = await projectRepository.getSVGVariableFeatures({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_variable_features.value = variable_features.data;

    const violin = await projectRepository.getSVGViolin({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_violin.value = violin.data;
    loading.value = false;
    const container = editor.value;
    if (!container) {
        return;
    }

    const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons

        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

        ['blockquote', 'code-block'],
        ['link', 'image'],

        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }]
    ];

    const options: QuillOptions = {
        debug: 'error',
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Start writing your report here...',
        theme: 'snow'
    };
    new Quill(container, options);
}

onMounted(() => {
    getProjects();
});
</script>

<template>
    <SelectProject
        v-if="!selected_project.id"
        :newProject="newProject"
        :isSelectedProject="isSelectedProject"
        :selectOrUnselectProject="selectOrUnselectProject"
        :deleteProject="deleteProject"
        :projects="projects"
        v-model:selected_project="selected_project"
        v-model:new_project_name="new_project_name"
        v-model:new_project_description="new_project_description"
    />

    <ResizablePanelGroup direction="horizontal" v-else>
        <ResizablePanel
            class="flex flex-col items-center max-w-60 p-6 py-8 h-[calc(100vh-4rem)] bg-secondary"
            :default-size="20"
        >
            <div class="flex flex-col gap-2">
                <UploadFile
                    v-model:selected_project="selected_project"
                    v-model:loading="loading"
                    :fetchGraphs="fetchGraphs"
                />

                <Separator class="my-4" />
                <CreateProjectForm
                    v-model:new_project_name="new_project_name"
                    v-model:new_project_description="new_project_description"
                    :newProject="newProject"
                />

                <Button
                    class="w-full rounded-full"
                    v-for="project in projects"
                    :key="project.id"
                    :variant="isSelectedProject(project)"
                    @click="selectOrUnselectProject(project)"
                >
                    <div class="flex items-center justify-between w-full gap-2">
                        {{ project.name }}
                        <Icon @click="deleteProject(project)" icon="iconoir:trash"></Icon>
                    </div>
                </Button>
            </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel
            class="h-[calc(100vh-4rem)] p-8 flex flex-col items-center"
            :default-size="40"
        >
            <div v-if="loading" class="w-full flex flex-wrap gap-2 items-center justify-center">
                <div class="flex items-center w-1/2 text-2xl">
                    <Icon icon="eos-icons:loading"></Icon> We are processing your data...
                </div>
                <Skeleton class="h-12 w-1/2 rounded-full" />
                <Skeleton class="h-12 w-1/2 rounded-full" />
                <Skeleton class="h-12 w-1/2 rounded-full" />
            </div>

            <ScrollArea class="h-full w-full mb-16">
                <PreProcessData
                    v-model:isOpen="isOpen"
                    v-model:svg_violin="svg_violin"
                    v-model:svg_variable_features="svg_variable_features"
                    v-model:svg_elbow="svg_elbow"
                    v-model:svg_umap="svg_umap"
                />
                <div class="flex flex-col gap-4">
                    <div
                        class="hover:bg-muted p-2 rounded"
                        v-for="(chat_element, index) in chat_content"
                        :key="index"
                    >
                        <div v-if="chat_element.request != ''" class="flex flex-col">
                            <div class="font-semibold flex gap-2 items-center">
                                <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                                    <Avatar class="h-8 w-8">
                                        <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                        <AvatarFallback
                                            >{{ userStore.getUser?.first_name.charAt(0)
                                            }}{{
                                                userStore.getUser?.last_name.charAt(0)
                                            }}</AvatarFallback
                                        >
                                    </Avatar>
                                </Button>
                                <div>You :</div>
                            </div>
                            <div class="pl-4">{{ chat_element.request }}</div>
                        </div>
                        <div>
                            <div class="font-semibold flex gap-1 items-center">
                                <img src="@/imgs/logos/logo.svg" class="w-8 self-center" />
                                <div>ExPlore :</div>
                            </div>
                            <div class="pl-4">
                                <VueMarkdown :source="chat_element.response" />
                            </div>
                        </div>
                    </div>
                    <div v-html="svg_graph"></div>
                </div>
            </ScrollArea>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel class="m-4" :default-size="40">
            <div ref="editor">
                <h1>Report</h1>
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>
    <RequestBar
        v-if="selected_project.id"
        :selected_project="selected_project"
        v-model:chat_content="chat_content"
        v-model:svg_graph="svg_graph"
        v-model:loading="loading"
    />
</template>
