<script lang="ts" setup>
import { Project } from '@/repositories/types/entities/Project';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { onMounted, ref, watchEffect, type Ref } from 'vue';
import ResizablePanelGroup from '@/shadcn/ui/resizable/ResizablePanelGroup.vue';
import { ResizablePanel } from '@/shadcn/ui/resizable';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';
import ResizableHandle from '@/shadcn/ui/resizable/ResizableHandle.vue';
import ProjectEditor from '@/views/projects/ProjectEditor.vue';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import RequestBar from '@/views/projects/RequestBar.vue';
import { useRoute } from 'vue-router';
import Button from '@/shadcn/ui/button/Button.vue';
import Avatar from '@/shadcn/ui/avatar/Avatar.vue';
import AvatarImage from '@/shadcn/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/shadcn/ui/avatar/AvatarFallback.vue';
import { BusinessLogicError } from '@/repositories/BaseRepository';
import ResponseCard from '@/views/projects/ReponseCard.vue';
import { useStateStore } from '@/stores/state';
import Progress from '@/shadcn/ui/progress/Progress.vue';
import type { ChatContent } from './types';
import type { Sample } from '@/repositories/types/entities/Sample';
import { SampleRepository } from '@/repositories/SampleRepository';
import LinkSamplesToProject from './LinkSamplesToProject.vue';
import SampleMenu from './SampleMenu.vue';
import moment from 'moment';

const state = useStateStore();
state.$reset();

state.page = 'results';

defineProps<{
    page?: string;
}>();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Refs
const samples: Ref<Array<Sample>> = ref([])

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();
const sampleRepository: SampleRepository = new SampleRepository();

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

const selected_project: Ref<Project> = ref(new Project());
const progress: Ref<number> = ref(10);
const loading: Ref<boolean> = ref(false)

watchEffect((cleanupFn) => {
    let timer = setTimeout(() => (progress.value = 10), 500);
    cleanupFn(() => clearTimeout(timer));
});
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
    if (samples.value.length == 0) return;
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

async function getSamplesByProject(project_id: string) {
    const res = await sampleRepository.getSamplesByProjectId({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        projectId: route.params.projectId as string,
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

    samples.value = res.data;
}

const route = useRoute()

onMounted(async () => {
    await getProject(route.params.projectId as string)
    await getSamplesByProject(selected_project.value.id)
    await getChatHistory(selected_project.value.id)
})
</script>
<template>
    <div class="flex">
        <div class="flex flex-col gap-8 items-center max-w-60 p-6 py-8 h-[calc(100vh-4rem)] bg-secondary">
            <div class="flex flex-col gap-2 items-center">
                <span class="text-primary">{{ selected_project.name }}</span>
                <span> {{ moment(selected_project.added_on).format('LL') }}</span>
            </div>
            <div class="flex flex-col gap-2 items-center">
                <span>Samples linked to this project:</span>
                <SampleMenu v-for="sample in samples" :key="sample.id" :sample="sample"></SampleMenu>
            </div>
        </div>
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel class="h-[calc(100vh-4rem)] p-4 flex flex-col items-center justify-center"
                :default-size="60">
                <div v-if="samples.length == 0" class="w-full flex flex-col gap-2 items-center justify-center">
                    <div class="text-2xl">Select samples to use in this project</div>
                    <LinkSamplesToProject v-model:samples="samples" :project_id="selected_project.id" />
                </div>

                <ScrollArea v-else class="h-full w-full mb-16">
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
                                        <div>You</div>
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
                                        <div>Ada</div>
                                    </div>
                                </div>

                                <ResponseCard :markdown_content="chat_element.response" :image="chat_element.image"
                                    :data="chat_element.data" :text="chat_element.text" :result="chat_element.result"
                                    :id="index">
                                </ResponseCard>
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