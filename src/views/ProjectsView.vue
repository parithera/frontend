<script lang="ts" setup>
import { Button } from '@/shadcn/ui/button';

import { useStateStore } from '@/stores/state';
import { useAuthStore } from '@/stores/auth';

import { Icon } from '@iconify/vue/dist/iconify.js';
import { onMounted, ref, watch, watchEffect, type Ref } from 'vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { useUserStore } from '@/stores/user';
import { Project } from '@/repositories/types/entities/Project';
import Skeleton from '@/shadcn/ui/skeleton/Skeleton.vue';
import Avatar from '@/shadcn/ui/avatar/Avatar.vue';
import AvatarImage from '@/shadcn/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/shadcn/ui/avatar/AvatarFallback.vue';
import ResizablePanelGroup from '@/shadcn/ui/resizable/ResizablePanelGroup.vue';
import { ResizablePanel } from '@/shadcn/ui/resizable';
import ResizableHandle from '@/shadcn/ui/resizable/ResizableHandle.vue';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';
import SelectProject from '@/views/projects/SelectProject.vue';
import CreateProjectForm from '@/views/projects/CreateProjectForm.vue';
import UploadFile from '@/views/projects/UploadFile.vue';
import RequestBar from '@/views/projects/RequestBar.vue';
import PreProcessData from '@/views/projects/PreProcessData.vue';
import ProjectEditor from '@/views/projects/ProjectEditor.vue';
import { BusinessLogicError } from '@/repositories/BaseRepository';
import Progress from '@/shadcn/ui/progress/Progress.vue';
import ResponseCard from '@/views/projects/ReponseCard.vue';

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

// Colalboration configuration
import { initVelt } from '@veltdev/client';

var client: any;

const setUser = () => {
    if (client) {
        const user = {
            userId: userStore.user?.id,
            name: userStore.user?.handle,
            email: userStore.user?.email,
            photoUrl: '',
            color: '#008491', // Use valid Hex code value. Used in the background color of the user's avatar.
            textColor: '#008491', // Use valid Hex code value. Used in the text color of the user's intial when photoUrl is not present.
            organizationId: 'organizationId123' //(optional) If you want to categorize the user into an organization
        }; // Your user object here
        client.identify(user);
    }
};

const setDocument = () => {
    if (client) {
        client.setDocument(selected_project.value.id, {
            documentName: selected_project.value.name
        });
    }
};

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
        setDocument();
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
    loading.value = false;
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

        chat_content.value = res.data.messages.sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

onMounted(async () => {
    getProjects();
    client = await initVelt('ZmXkY3lHSJaiE85JRGsz');
    setUser();
    setDocument();

    if (client) {
        const selectionElement = client.getSelectionElement();
        selectionElement.enableLiveSelection();
        selectionElement.disableLiveSelection();
    }
});

watch(selected_project, () => {
    getChatHistory(selected_project.value.id);
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

    <div class="flex" v-else>
        <div
            class="flex flex-col gap-2 items-center max-w-60 p-6 py-8 h-[calc(100vh-4rem)] bg-secondary"
        >
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
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
                class="h-[calc(100vh-4rem)] p-4 flex flex-col items-center justify-center"
                :default-size="60"
            >
                <div v-if="loading" class="w-full flex flex-col gap-2 items-center justify-center">
                    <div class="flex items-center text-2xl">
                        <Icon icon="eos-icons:loading"></Icon> We are processing your data...
                    </div>
                    <div class="flex items-center text-xl">This may take a while.</div>
                    <Skeleton class="h-12 w-1/2 rounded-full" />
                    <Skeleton class="h-12 w-1/2 rounded-full" />
                    <Skeleton class="h-12 w-1/2 rounded-full" />
                </div>
                <div
                    v-else-if="svg_violin == ''"
                    class="w-full flex flex-col gap-2 items-center justify-center"
                >
                    <div class="text-2xl">No Data found, please import a file</div>
                    <UploadFile
                        v-model:selected_project="selected_project"
                        v-model:loading="loading"
                        :fetchGraphs="fetchGraphs"
                    />
                </div>

                <ScrollArea v-else class="h-full w-full mb-16">
                    <PreProcessData
                        v-model:isOpen="isOpen"
                        v-model:svg_violin="svg_violin"
                        v-model:svg_variable_features="svg_variable_features"
                        v-model:svg_elbow="svg_elbow"
                        v-model:svg_umap="svg_umap"
                    />
                    <div class="flex flex-col-reverse">
                        <div
                            class="border-l hover:border-primary pl-2 pt-4 flex flex-col gap-4"
                            v-for="(chat_element, index) in chat_content"
                            :key="index"
                        >
                            <div v-if="chat_element.request != ''" class="flex flex-col gap-2">
                                <div class="w-full flex justify-between">
                                    <div class="font-semibold flex gap-2 items-center">
                                        <Button
                                            variant="ghost"
                                            class="relative h-8 w-8 rounded-full"
                                        >
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
                                </div>

                                <div class="pl-8">
                                    <span>{{ chat_element.request }}</span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <div class="w-full flex justify-between">
                                    <div class="font-semibold flex gap-2 items-center">
                                        <img src="@/imgs/logos/logo.svg" class="w-8 self-center" />
                                        <div>ExPlore :</div>
                                    </div>
                                </div>

                                <ResponseCard
                                    :markdown_content="chat_element.response"
                                    :image="chat_element.image"
                                ></ResponseCard>
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
            <ResizablePanel class="p-2 m-4" :default-size="40">
                <div class="flex item-center justify-between">
                    <span class="text-lg">Write your report here:</span>
                    <velt-presence></velt-presence>
                </div>
                <ScrollArea class="h-[calc(100vh-13rem)] cursor-text">
                    <ProjectEditor />
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
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
