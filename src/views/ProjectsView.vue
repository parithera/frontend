<script lang="ts" setup>
import { Button } from '@/shadcn/ui/button';

import { useStateStore } from '@/stores/state';
import { useAuthStore } from '@/stores/auth';

import { Icon } from '@iconify/vue/dist/iconify.js';
import { onMounted, onUpdated, ref, watch, watchEffect, type Ref } from 'vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { useUserStore } from '@/stores/user';
import { Project } from '@/repositories/types/entities/Project';
import Skeleton from '@/shadcn/ui/skeleton/Skeleton.vue';
import Avatar from '@/shadcn/ui/avatar/Avatar.vue';
import AvatarImage from '@/shadcn/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/shadcn/ui/avatar/AvatarFallback.vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
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
import { BusinessLogicError } from '@/repositories/BaseRepository';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import Dialog from '@/shadcn/ui/dialog/Dialog.vue';
import DialogTrigger from '@/shadcn/ui/dialog/DialogTrigger.vue';
import DialogContent from '@/shadcn/ui/dialog/DialogContent.vue';
import ScrollBar from '@/shadcn/ui/scroll-area/ScrollBar.vue';
import Progress from '@/shadcn/ui/progress/Progress.vue';

const state = useStateStore();
state.$reset();
state.page = 'dashboard';

defineProps<{
    page: string;
}>();

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

const markdown = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
        }

        return ''; // use external default escaping
    }
});

export type ChatContent = {
    request: string;
    response: string;
    image: string;
};

let chat_content: Ref<ChatContent[]> = ref([
    {
        request: '',
        response: 'Hi, how can I help you today?',
        image: ''
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
const loading = ref(false);
const isOpen = ref(false);

const quillEditor: Ref<Quill | undefined> = ref();

const editor = useTemplateRef<HTMLDivElement>('editor');

const progress: Ref<number> = ref(10);

watchEffect((cleanupFn) => {
    let timer = setTimeout(() => (progress.value = 10), 500);
    cleanupFn(() => clearTimeout(timer));
});

async function newProject() {
    chat_content.value = [
        {
            request: '',
            response: 'Hi, how can I help you today?',
            image: ''
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
    try {
        await projectRepository.deleteProject({
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            projectId: project.id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            console.log(error);
        }
    }
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
                return;
            }
        }
        fetchGraphs(project);
    }
}

async function fetchGraphs(project: Project) {
    while (svg_elbow.value == '') {
        try {
            const elbow = await projectRepository.getSVGElbow({
                bearerToken: authStore.getToken ?? '',
                handleBusinessErrors: true,
                projectId: project.id,
                orgId: userStore.defaultOrg?.id ?? ''
            });

            svg_elbow.value = elbow.data;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }

    while (svg_umap.value == '') {
        try {
            const umap = await projectRepository.getSVGUMAP({
                bearerToken: authStore.getToken ?? '',
                handleBusinessErrors: true,
                projectId: project.id,
                orgId: userStore.defaultOrg?.id ?? ''
            });

            svg_umap.value = umap.data;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }

    while (svg_variable_features.value == '') {
        try {
            const variable_features = await projectRepository.getSVGVariableFeatures({
                bearerToken: authStore.getToken ?? '',
                handleBusinessErrors: true,
                projectId: project.id,
                orgId: userStore.defaultOrg?.id ?? ''
            });

            svg_variable_features.value = variable_features.data;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }

    while (svg_violin.value == '') {
        try {
            const violin = await projectRepository.getSVGViolin({
                bearerToken: authStore.getToken ?? '',
                handleBusinessErrors: true,
                projectId: project.id,
                orgId: userStore.defaultOrg?.id ?? ''
            });

            svg_violin.value = violin.data;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}

function initQuill() {
    // If editor already created
    if (quillEditor.value) return;

    const container = editor.value;
    // If container not displayed
    if (!container) return;

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
    quillEditor.value = new Quill(container, options);
}

function addToReport(content: string) {
    quillEditor.value?.insertText(quillEditor.value.getLength(), content);
}

function addImageToReport(content: string) {
    quillEditor.value?.insertEmbed(quillEditor.value.getLength(), 'image', content);
}

async function getChatHistory(project_id: string) {
    if (selected_project.value.files?.length == 0) return;
    if (loading.value) return;
    // if (svg_elbow.value == '') return;
    try {
        const res = await projectRepository.getChatHistory({
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            projectId: project_id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
        chat_content.value = res.data.messages;
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

onMounted(() => {
    getProjects();
});

watch(selected_project, () => {
    getChatHistory(selected_project.value.id);
});

onUpdated(() => {
    initQuill();
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
            class="h-[calc(100vh-4rem)] p-8 flex flex-col items-center justify-center"
            :default-size="40"
        >
            <div v-if="loading" class="w-full flex flex-wrap gap-2 items-center justify-center">
                <div class="flex items-center w-2/3 text-2xl">
                    <Icon icon="eos-icons:loading"></Icon> We are processing your data...
                </div>
                <Skeleton class="h-12 w-1/2 rounded-full" />
                <Skeleton class="h-12 w-1/2 rounded-full" />
                <Skeleton class="h-12 w-1/2 rounded-full" />
            </div>

            <ScrollArea v-else class="h-full w-full mb-16">
                <PreProcessData
                    v-model:isOpen="isOpen"
                    v-model:svg_violin="svg_violin"
                    v-model:svg_variable_features="svg_variable_features"
                    v-model:svg_elbow="svg_elbow"
                    v-model:svg_umap="svg_umap"
                />
                <div class="flex flex-col-reverse gap-4">
                    <div
                        class="border-l-2 hover:border-primary p-2"
                        v-for="(chat_element, index) in chat_content"
                        :key="index"
                    >
                        <div v-if="chat_element.request != ''" class="flex flex-col">
                            <div class="w-full flex justify-between">
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
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <Button
                                                class="flex gap-2"
                                                variant="outline"
                                                @click="addToReport(chat_element.request)"
                                            >
                                                <span>Add</span>
                                                <Icon class="text-2xl" icon="prime:copy"></Icon>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Send to report</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <div class="pl-4">
                                <span>{{ chat_element.request }}</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-4">
                            <div class="w-full flex justify-between">
                                <div class="font-semibold flex gap-1 items-center">
                                    <img src="@/imgs/logos/logo.svg" class="w-8 self-center" />
                                    <div>ExPlore :</div>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <Button
                                                class="flex gap-2"
                                                variant="outline"
                                                @click="addToReport(chat_element.response)"
                                            >
                                                <span>Add</span>
                                                <Icon class="text-2xl" icon="prime:copy"></Icon>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Send to report</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <ScrollArea>
                                <div
                                    class="overflow-x-scroll pl-4"
                                    id="markdown"
                                    v-html="markdown.render(chat_element.response)"
                                ></div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            <div
                                class="pl-4 flex flex-col items-center"
                                v-if="chat_element.image != ''"
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <Button
                                                class="flex gap-2"
                                                variant="outline"
                                                @click="
                                                    addImageToReport(
                                                        'data:image/png;base64,' +
                                                            chat_element.image
                                                    )
                                                "
                                            >
                                                <span>Add</span>
                                                <Icon class="text-2xl" icon="prime:copy"></Icon>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Send to report</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <img
                                            class="cursor-pointer w-1/2 hover:scale-105 hover:translate-y-2 transition duration-300 ease-in-out"
                                            :src="'data:image/png;base64,' + chat_element.image"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <img :src="'data:image/png;base64,' + chat_element.image" />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div
                                class="pl-4 flex flex-col items-center"
                                v-if="
                                    chat_element.response.endsWith(
                                        'Please wait while the script is running'
                                    ) && chat_element.image == ''
                                "
                            >
                                <Progress v-model="progress" class="w-3/5"></Progress>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel class="h-[calc(100vh-4rem)] p-2 m-4" :default-size="40">
            <ScrollArea class="h-full">
                <div ref="editor">
                    <h1>Report</h1>
                </div>
            </ScrollArea>
        </ResizablePanel>
    </ResizablePanelGroup>
    <RequestBar
        v-if="selected_project.id"
        :selected_project="selected_project"
        v-model:chat_content="chat_content"
        v-model:loading="loading"
        v-model:progress="progress"
    />
</template>

<style lang="scss">
@import 'highlight.js/styles/atom-one-dark.css';

#markdown a {
    color: hsl(191, 89%, 18%);
    text-decoration: underline;
    font-weight: bold;
}
</style>
