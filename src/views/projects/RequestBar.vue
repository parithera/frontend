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
const progress: ModelRef<number> = defineModel('progress', { required: true });

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
        image: '',
        data: '',
        text: '',
        result: ''
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
            userId: userStore.user?.id ?? '',
            organizationId: userStore.getDefaultOrg?.id ?? ''
        }
    });

    setTimeout(() => (progress.value = 10), 500);
    setTimeout(() => (progress.value = progress.value + 10), 1000);
    setTimeout(() => (progress.value = progress.value + 10), 1500);
    setTimeout(() => (progress.value = progress.value + 10), 3000);
    setTimeout(() => (progress.value = progress.value + 10), 4000);
    setTimeout(() => (progress.value = progress.value + 10), 4700);
    setTimeout(() => (progress.value = progress.value + 10), 6000);
    setTimeout(() => (progress.value = progress.value + 10), 6100);
    setTimeout(() => (progress.value = progress.value + 10), 7500);
    setTimeout(() => (progress.value = progress.value + 10), 8000);

    chat_content.value.shift();
    chat_content.value.splice(0, 0, {
        request: request,
        response: result.data.answer,
        image: '',
        data: '',
        text: '',
        result: ''
    });

    // const scroll = document.getElementById('scrollArea');
    // scroll.childNodes[0].scrollTop = scroll.scrollHeight;

    let analysis_id = '';

    if (result.data.type == 'chat') {
        const analyzer = await analyzerRepository.getAnalyzerByName({
            bearerToken: authStore.getToken ?? '',
            orgId: userStore.defaultOrg?.id ?? '',
            analyzer_name: 'execute_python_script'
        });

        const res = await projectRepository.createAnalysis({
            orgId: userStore.defaultOrg?.id ?? '',
            projectId: props.selected_project.id,
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            data: {
                analyzer_id: analyzer.data.id,
                config: {
                    python: {
                        project: props.selected_project.id,
                        user: props.selected_project.added_by?.id,
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
            if (result.data.image != '') {
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
        chat_content.value[0].image =
            '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';
        loading.value = false;
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
