<script lang="ts" setup>
import { Project } from '@/views/projects/project.entity';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { onMounted, ref, watchEffect, type Ref } from 'vue';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';
import { ProjectRepository } from '@/views/projects/project.repository';
import RequestBar from '@/views/projects/RequestBar.vue';
import { useRoute } from 'vue-router';
import Button from '@/shadcn/ui/button/Button.vue';
import Avatar from '@/shadcn/ui/avatar/Avatar.vue';
import AvatarImage from '@/shadcn/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/shadcn/ui/avatar/AvatarFallback.vue';
import { BusinessLogicError } from '@/types/BaseRepository';
import ResponseCard from '@/views/results/chat/ReponseCard.vue';
import { useStateStore } from '@/stores/state';
import Progress from '@/shadcn/ui/progress/Progress.vue';
import type { ChatContent } from './types';
import type { Sample } from '@/views/samples/sample.entity';
import { SampleRepository } from '@/views/samples/sample.repository';
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
const samples: Ref<Array<Sample>> = ref([]);

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();
const sampleRepository: SampleRepository = new SampleRepository();

const chat_content: Ref<ChatContent[]> = ref([
    {
        request: '',
        text: 'Hi, how can I help you today?',
        code: '',
        followup: [],
        json: {
            type: '',
            data: []
        },
        image: '',
        error: '',
        status: '',
        agent: ''
    }
]);

const selected_project: Ref<Project> = ref(new Project());
const progress: Ref<number> = ref(10);
const loading: Ref<boolean> = ref(false);

watchEffect((cleanupFn) => {
    const timer = setTimeout(() => (progress.value = 10), 500);
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

        selected_project.value = res.data;
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
                console.log('No history');
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
        projectId: project_id,
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

const route = useRoute();

onMounted(async () => {
    await getProject(route.params.projectId as string);
    await getSamplesByProject(selected_project.value.id);
    await getChatHistory(selected_project.value.id);
});
</script>
<template>
    <div class="flex h-[calc(100vh-3rem)]">
        <div class="flex flex-col gap-8 items-center max-w-60 p-6 py-8 bg-secondary">
            <div class="flex flex-col gap-2 items-center">
                <span class="text-primary">{{ selected_project.name }}</span>
                <span> {{ moment(selected_project.added_on).format('LL') }}</span>
            </div>
            <div class="flex flex-col gap-2 items-center">
                <span>Samples linked to this project:</span>
                <SampleMenu
                    v-for="sample in samples"
                    :key="sample.id"
                    :sample="sample"
                ></SampleMenu>
            </div>
        </div>
        <div
            v-if="samples.length == 0"
            class="w-full flex flex-col gap-2 items-center justify-center"
        >
            <LinkSamplesToProject v-model:samples="samples" :project-id="selected_project.id" />
        </div>

        <ScrollArea v-else class="w-full">
            <div class="flex flex-col-reverse pb-24">
                <div
                    v-for="(chat_element, index) in chat_content"
                    :key="index"
                    class="border-l hover:border-primary pl-2 pt-4 flex flex-col gap-4"
                >
                    <div v-if="chat_element.request != ''" class="flex flex-col gap-2">
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
                                <div>You</div>
                            </div>
                        </div>

                        <div class="pl-10">
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

                        <ResponseCard :id="index" :response="chat_element"></ResponseCard>
                        <div
                            v-if="
                                chat_element.text.endsWith(
                                    'Please wait while the script is running'
                                ) && chat_element.image == ''
                            "
                            class="pl-4 flex flex-col items-center"
                        >
                            <Progress v-model="progress" class="w-3/5"></Progress>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    </div>
    <RequestBar
        v-if="selected_project.id"
        v-model:chat-content="chat_content"
        v-model:loading="loading"
        v-model:progress="progress"
        :selected-project="selected_project"
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
