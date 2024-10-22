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
import { useTemplateRef, type ModelRef } from 'vue';
import type { ChatContent } from '../ProjectsView.vue';
import { BusinessLogicError } from '@/repositories/BaseRepository';

const props = defineProps<{
    selected_project: Project;
}>();

const chat_content: ModelRef<ChatContent[]> = defineModel('chat_content', { required: true });
const loading: ModelRef<boolean> = defineModel('loading', { required: true });

// Repositories
const chatRepository: ChatRepository = new ChatRepository();
const projectRepository: ProjectRepository = new ProjectRepository();
const analyzerRepository: AnalyzerRepository = new AnalyzerRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

const requestInput = useTemplateRef('RequestInput');

const { handleSubmit } = useForm({
    // validationSchema: formSchema
});

const onSubmit = handleSubmit((values) => {
    chat_content.value.splice(0, 0, {
        request: values.request,
        response: 'Loading...',
        image: ''
    });
    askGPT(values.request);
    requestInput.value?.setValue('');
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

    chat_content.value.shift();
    chat_content.value.splice(0, 0, {
        request: request,
        response: result.data.answer,
        image: ''
    });

    const scroll = document.getElementById('scrollArea');
    // scroll.childNodes[0].scrollTop = scroll.scrollHeight;

    let analysis_id = '';

    if (result.data.type == 'chat') {
        const analyzer = await analyzerRepository.getAnalyzerByName({
            bearerToken: authStore.getToken ?? '',
            orgId: userStore.defaultOrg?.id ?? '',
            analyzer_name: 'initialization'
        });

        const res = await projectRepository.createAnalysis({
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
        analysis_id = res.id;
    }

    let result_id = '';

    while (result_id == '') {
        try {
            const result = await projectRepository.getResultByAnalysisId({
                bearerToken: authStore.getToken ?? '',
                projectId: props.selected_project.id,
                orgId: userStore.defaultOrg?.id ?? '',
                analysisId: analysis_id,
                handleBusinessErrors: true
            });
            result_id = result.data.id;
            if (result_id != '') {
                fetchChatGraph(result.data.image);
            } else {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}

async function fetchChatGraph(analysis_id: string) {
    try {
        const graph = await projectRepository.getAnalysisGraph({
            bearerToken: authStore.getToken ?? '',
            projectId: props.selected_project.id,
            orgId: userStore.defaultOrg?.id ?? '',
            analysisId: analysis_id,
            handleBusinessErrors: true
        });

        chat_content.value[0].image = graph.data;
        loading.value = false;
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            console.error(error);
        }
        console.error(error);
    }
}
</script>

<template>
    <form class="w-1/2 left-1/4 bottom-6 fixed" @submit="onSubmit">
        <FormField ref="RequestInput" v-slot="{ componentField }" name="request">
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
