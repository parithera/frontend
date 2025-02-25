<script setup lang="ts">
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
import { useTemplateRef, watch, type ModelRef } from 'vue';
import type { ChatContent } from '../results/types';
import { useChatStore } from '@/sockets/chat';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    selected_project: Project;
}>();

const chat_content: ModelRef<ChatContent[]> = defineModel('chat_content', { required: true });

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();

const requestInput = useTemplateRef('RequestInput');

const { handleSubmit } = useForm({
    // validationSchema: formSchema
});

const { response } = storeToRefs(chatStore);

async function askChat(request: string) {
    chatStore.$reset();
    chatStore.createSocket(authStore.getToken ?? '');
    // remove any existing listeners (after a hot module replacement)
    chatStore.getSocket.off();
    chatStore.bindEvents();
    chatStore.connect();

    chatStore.askChat({
        request: request,
        projectId: props.selected_project.id,
        userId: userStore.user?.id ?? '',
        organizationId: userStore.getDefaultOrg?.id ?? ''
    });
}

watch(response, () => {
    chat_content.value.shift();
    chat_content.value.splice(0, 0, {
        request: chatStore.request,
        code: response.value?.data.code ?? '',
        followup: response.value?.data.followup ?? [],
        text: response.value?.data.text ?? '',
        json: response.value?.data.json ?? {},
        image: response.value?.data.image ?? '',
        error: response.value?.data.error ?? '',
        status: response.value?.data.status ?? 'starting',
        agent: response.value?.data.agent ?? '',
    });
})

const onSubmit = handleSubmit((values) => {
    chat_content.value.splice(0, 0, {
        request: values.request,
        code: response.value?.data.code ?? '',
        followup: response.value?.data.followup ?? [],
        text: 'Loading...',
        json: response.value?.data.json ?? {},
        image: response.value?.data.image ?? '',
        error: response.value?.data.error ?? '',
        status: response.value?.data.status ?? 'starting',
        agent: response.value?.data.agent ?? '',
    });
    askChat(values.request);
    requestInput.value?.setValue('');
});
</script>

<template>
    <form class="w-1/2 left-1/4 bottom-6 fixed" @submit="onSubmit">
        <FormField ref="RequestInput" v-slot="{ componentField }" name="request">
            <FormItem>
                <!-- <FormLabel>Bio</FormLabel> -->
                <FormControl>
                    <div class="relative flex items-center">
                        <Input
                            placeholder="Ask Ada anything..."
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
