<script setup lang="ts">
import { AnalyzerRepository } from '@/repositories/AnalyzerRepository';
import { ChatRepository } from '@/repositories/ChatRepository';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import type { Project } from '@/repositories/types/entities/Project';
import Button from '@/shadcn/ui/button/Button.vue';
import { FormField } from '@/shadcn/ui/form';
import FormControl from '@/shadcn/ui/form/FormControl.vue';
import FormItem from '@/shadcn/ui/form/FormItem.vue';
import FormMessage from '@/shadcn/ui/form/FormMessage.vue';
import Input from '@/shadcn/ui/input/Input.vue';
import Label from '@/shadcn/ui/label/Label.vue';
import Switch from '@/shadcn/ui/switch/Switch.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useForm } from 'vee-validate';
import type { ModelRef } from 'vue';
import type { ChatContent } from '../ProjectsView.vue';

const props = defineProps<{
    selected_project: Project;
}>();

const chat_content: ModelRef<ChatContent[]> = defineModel('chat_content', { required: true });
const svg_graph: ModelRef<string> = defineModel('svg_graph', { required: true });
const loading: ModelRef<boolean> = defineModel('loading', { required: true });

// Repositories
const chatRepository: ChatRepository = new ChatRepository();
const projectRepository: ProjectRepository = new ProjectRepository();
const analyzerRepository: AnalyzerRepository = new AnalyzerRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

const { handleSubmit } = useForm({
    // validationSchema: formSchema
});

const onSubmit = handleSubmit((values) => {
    chat_content.value.push({
        request: values.request,
        response: 'Loading...'
    });
    askGPT(values.request);
});

async function askGPT(request: string) {
    const result = await chatRepository.askGPT({
        bearerToken: authStore.getToken ?? '',
        data: {
            request: request,
            projectId: props.selected_project.id,
            userId: userStore.user?.id ?? ''
        }
    });

    chat_content.value[chat_content.value.length - 1].response = result.data.answer;

    if (result.data.type == 'chat') {
        const analyzer = await analyzerRepository.getAnalyzerByName({
            bearerToken: authStore.getToken ?? '',
            orgId: userStore.defaultOrg?.id ?? '',
            analyzer_name: 'initialization'
        });

        await projectRepository.createAnalysis({
            orgId: userStore.defaultOrg?.id ?? '',
            projectId: props.selected_project.id,
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            data: {
                analyzer_id: analyzer.data.id,
                config: {
                    r: {
                        project: props.selected_project.id,
                        user: userStore.user?.id,
                        type: 'chat'
                    }
                },
                branch: ' ', // This will be removed
                commit_hash: ' ' // This will be removed
            }
        });
    }

    // Try to fetch graph every 5 seconds
    setInterval(() => {
        if (props.selected_project.id) {
            fetchChatGraph();
            return;
        }
    }, 5000);
}

async function fetchChatGraph() {
    const graph = await projectRepository.getSVGGraph({
        bearerToken: authStore.getToken ?? '',
        projectId: props.selected_project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_graph.value = graph.data;
    loading.value = false;
}
</script>

<template>
    <form class="w-1/2 left-1/4 bottom-6 fixed" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="request">
            <FormItem>
                <!-- <FormLabel>Bio</FormLabel> -->
                <FormControl>
                    <div class="relative flex items-center">
                        <Input
                            placeholder="Tell ExPlore what graph you want to generate..."
                            class="resize-none rounded-full pl-2 py-7 box-border h-6 w-full"
                            v-bind="componentField"
                            type="text"
                        ></Input>
                        <div class="absolute right-16 flex items-center gap-2">
                            <Switch id="advanced-mode" />
                            <Label for="advanced-mode">Advanced</Label>
                        </div>

                        <div class="absolute right-2 flex items-center gap-2">
                            <Button class="w-10 h-10 rounded-full bg-secondary" type="submit"
                                ><Icon class="text-primary -m-1" icon="bi:send-fill"></Icon
                            ></Button>
                        </div>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
    </form>
</template>
