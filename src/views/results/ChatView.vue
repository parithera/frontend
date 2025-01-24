<script lang="ts" setup>
import { Project } from '@/repositories/types/entities/Project';
import { useAuthStore } from '@/stores/auth';
import { useConnectionStore } from '@/stores/connection';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, watchEffect, type Ref } from 'vue';
import UploadFile from '@/views/projects/UploadFile.vue';
import ResizablePanelGroup from '@/shadcn/ui/resizable/ResizablePanelGroup.vue';
import { ResizablePanel } from '@/shadcn/ui/resizable';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';
import ResizableHandle from '@/shadcn/ui/resizable/ResizableHandle.vue';
import ProjectEditor from '@/views/projects/ProjectEditor.vue';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import RequestBar from '@/views/projects/RequestBar.vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '@/shadcn/ui/button/Button.vue';
import Avatar from '@/shadcn/ui/avatar/Avatar.vue';
import AvatarImage from '@/shadcn/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/shadcn/ui/avatar/AvatarFallback.vue';
import { BusinessLogicError } from '@/repositories/BaseRepository';
import ResponseCard from '@/views/projects/ReponseCard.vue';
import { toast } from '@/shadcn/ui/toast';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useStateStore } from '@/stores/state';
import Progress from '@/shadcn/ui/progress/Progress.vue';
import CreateGroups from './CreateGroups.vue';
import ConfigureAnalysis from './ConfigureAnalysis.vue';
import type { ChatContent, Group } from './types';

const state = useStateStore();
state.$reset();

state.page = 'results';

defineProps<{
    page?: string;
}>();

// Stores
const connectionStore = useConnectionStore();
const authStore = useAuthStore();
const userStore = useUserStore();

// Refs
const groups: Ref<Array<Group>> = ref([])
const file_type: Ref<string> = ref('')

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

let chat_content: Ref<ChatContent[]> = ref([
    {
        request: '',
        response: 'Hi, how can I help you today?',
        image: '',
        data: '',
        text: '',
        result: ''
    }
]);
const { svg_elbow, svg_umap, svg_violin, svg_variable_features } = storeToRefs(connectionStore);

const selected_project: Ref<Project> = ref(new Project());
const progress: Ref<number> = ref(10);
const progress_preprocess: Ref<number> = ref(0);
const loading: Ref<boolean> = ref(false)
const create_groups: Ref<boolean> = ref(false)
const configure_analysis: Ref<boolean> = ref(false)

watchEffect((cleanupFn) => {
    let timer = setTimeout(() => (progress.value = 10), 500);
    cleanupFn(() => clearTimeout(timer));
});

async function fetchGraphs(project: Project) {
    connectionStore.$reset;
    connectionStore.createSocket(authStore.getToken ?? '');
    // remove any existing listeners (after a hot module replacement)
    connectionStore.getSocket.off();
    connectionStore.bindEvents();
    connectionStore.connect();

    const graphs = ['pca_variance_ratio', 'violin', 'umap', 'filter_genes_dispersion'];
    for (const graph of graphs) {
        connectionStore.fetchGraphs({
            projectId: project.id,
            orgId: userStore.defaultOrg?.id ?? '',
            type: graph
        });
    }
    create_groups.value = false
    configure_analysis.value = false
}

async function getProject(project_id: string) {
    try {
        const res = await projectRepository.getProjectById({
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            projectId: project_id,
            orgId: userStore.defaultOrg?.id ?? ''
        });

        selected_project.value = res.data
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

async function getChatHistory(project_id: string) {
    if (selected_project.value.files?.length == 0) return;
    if (loading.value) return;

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
            if (error.error_code == 'EntityNotFound') {
                console.log("No history");
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

const route = useRoute()

onMounted(async () => {
    await getProject(route.params.projectId as string)
    await fetchGraphs(selected_project.value)
    await getChatHistory(selected_project.value.id)

    watch([svg_elbow, svg_umap, svg_variable_features, svg_violin], () => {
        progress_preprocess.value += 25;
        if (
            svg_elbow.value != '' &&
            svg_umap.value != '' &&
            svg_variable_features.value != '' &&
            svg_violin.value != ''
        ) {
            loading.value = false;
            toast({
                title: 'File analyzed successfully!',
                description: 'Start chatting with ExPlore'
            });
        }
    });
})
</script>
<template>
    <div class="flex">
        <div class="flex flex-col gap-2 items-center max-w-60 p-6 py-8 h-[calc(100vh-4rem)] bg-secondary">
            <span>{{ selected_project.name }}</span>
            <span>{{ selected_project.added_on }}</span>
        </div>
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel class="h-[calc(100vh-4rem)] p-4 flex flex-col items-center justify-center"
                :default-size="60">
                <div v-if="loading" class="w-full flex flex-col gap-2 items-center justify-center">
                    <div class="flex items-center text-2xl">
                        <Icon icon="eos-icons:loading"></Icon> We are processing your data...
                    </div>
                    <div class="flex items-center text-xl">This may take a while.</div>
                    <Progress class="w-1/2" v-model="progress_preprocess"></Progress>
                </div>
                <ConfigureAnalysis v-else-if="configure_analysis" v-model:selected_project="selected_project"
                    v-model:configure_analysis="configure_analysis" v-model:loading="loading" :groups :file_type :fetchGraphs>
                </ConfigureAnalysis>
                <CreateGroups v-else-if="create_groups" v-model:file_type="file_type"
                    v-model:create_groups="create_groups" v-model:configure_analysis="configure_analysis"
                    v-model:selected_project="selected_project" v-model:groups="groups">
                </CreateGroups>

                <div v-else-if="svg_violin == ''" class="w-full flex flex-col gap-2 items-center justify-center">
                    <div class="text-2xl">Select files to import</div>
                    <UploadFile v-model:selected_project="selected_project" v-model:create_groups="create_groups"
                        :fetchGraphs="fetchGraphs" />
                </div>

                <ScrollArea v-else class="h-full w-full mb-16">
                    <RouterLink :to="{ name: 'results', params: { projectId: selected_project.id, page: 'qc' } }">
                        <Button class="rounded-full">🔎 Show QC</Button>
                    </RouterLink>
                    <div class="flex flex-col-reverse">
                        <div class="border-l hover:border-primary pl-2 pt-4 flex flex-col gap-4"
                            v-for="(chat_element, index) in chat_content" :key="index">
                            <div v-if="chat_element.request != ''" class="flex flex-col gap-2">
                                <div class="w-full flex justify-between">
                                    <div class="font-semibold flex gap-2 items-center">
                                        <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                                            <Avatar class="h-8 w-8">
                                                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                                <AvatarFallback>{{ userStore.getUser?.first_name.charAt(0)
                                                    }}{{
                                                        userStore.getUser?.last_name.charAt(0)
                                                    }}</AvatarFallback>
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

                                <ResponseCard :markdown_content="chat_element.response" :image="chat_element.image"
                                    :data="chat_element.data" :text="chat_element.text" :result="chat_element.result"
                                    :id="index"></ResponseCard>
                                <div class="pl-4 flex flex-col items-center" v-if="
                                    chat_element.response.endsWith(
                                        'Please wait while the script is running'
                                    ) && chat_element.image == ''
                                ">
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
    <RequestBar v-if="selected_project.id" :selected_project="selected_project" v-model:chat_content="chat_content"
        v-model:loading="loading" v-model:progress="progress" />
</template>

<style lang="scss">
@import 'highlight.js/styles/atom-one-dark.css';

#markdown a {
    color: hsl(191, 89%, 18%);
    text-decoration: underline;
    font-weight: bold;
}
</style>