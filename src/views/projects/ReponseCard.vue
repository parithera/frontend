<script setup lang="ts">
import Tooltip from '@/shadcn/ui/tooltip/Tooltip.vue';
import TooltipProvider from '@/shadcn/ui/tooltip/TooltipProvider.vue';
import TooltipContent from '@/shadcn/ui/tooltip/TooltipContent.vue';
import TooltipTrigger from '@/shadcn/ui/tooltip/TooltipTrigger.vue';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';
import ScrollBar from '@/shadcn/ui/scroll-area/ScrollBar.vue';
import Dialog from '@/shadcn/ui/dialog/Dialog.vue';
import DialogTrigger from '@/shadcn/ui/dialog/DialogTrigger.vue';
import DialogContent from '@/shadcn/ui/dialog/DialogContent.vue';
import Button from '@/shadcn/ui/button/Button.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { ref, type Ref } from 'vue';

const props = defineProps<{
    markdown_content: string;
    image: string;
}>();

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
            } catch (__) {
                console.log('error hljs');
            }
        }

        return ''; // use external default escaping
    }
});

const icon: Ref<string> = ref('octicon:paste-24');
const icon_image: Ref<string> = ref('octicon:paste-24');

function copy() {
    navigator.clipboard.writeText(props.markdown_content);
    icon.value = 'tabler:check';
}
async function copyImage() {
    const makeImagePromise = async () => {
        const fetchedImageData = await fetch('data:image/png;base64,' + props.image);
        return await fetchedImageData.blob();
    };
    try {
        navigator.clipboard.write([
            new ClipboardItem({
                'image/png': makeImagePromise()
            })
        ]);
    } catch (error) {
        console.error(error);
    }
    icon_image.value = 'tabler:check';
}
</script>

<template>
    <div class="flex flex-col items-center gap-2">
        <div class="flex flex-col w-full">
            <ScrollArea>
                <div
                    class="overflow-x-scroll pl-8 pb-3"
                    id="markdown"
                    v-html="markdown.render(markdown_content)"
                ></div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div class="flex justify-between px-4">
                <div class="flex items-center gap-2">
                    <Button class="rounded-full" variant="ghost" size="sm">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger class="flex items-center gap-2">
                                    <Icon icon="majesticons:share-line"></Icon> Share
                                </TooltipTrigger>
                                <TooltipContent>Share Link</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Button>
                    <Button class="rounded-full" variant="ghost" size="sm">
                        <Icon icon="iconoir:redo"></Icon> Rewrite
                    </Button>
                </div>
                <div class="flex items-center gap-2">
                    <Button @click="copy" class="rounded-full" variant="ghost" size="sm">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger class="flex items-center gap-2">
                                    <Icon :icon="icon"></Icon>
                                </TooltipTrigger>
                                <TooltipContent>Copy</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Button>
                    <Button class="rounded-full" variant="ghost" size="sm">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger class="flex items-center gap-2">
                                    <Icon icon="tabler:edit"></Icon>
                                </TooltipTrigger>
                                <TooltipContent>Edit Query</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Button>
                    <Button class="rounded-full" variant="ghost" size="sm">
                        <Icon icon="tabler:dots"></Icon>
                    </Button>
                </div>
            </div>
        </div>

        <Dialog>
            <DialogTrigger asChild>
                <img
                    class="cursor-pointer w-1/2 hover:scale-105 hover:translate-y-2 transition duration-300 ease-in-out"
                    :src="'data:image/png;base64,' + image"
                />
                <div class="flex items-center gap-2">
                    <Button @click="copyImage" class="rounded-full" variant="ghost" size="sm">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger class="flex items-center gap-2">
                                    <Icon :icon="icon_image"></Icon>
                                </TooltipTrigger>
                                <TooltipContent>Copy</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Button>
                    <Button class="rounded-full" variant="ghost" size="sm">
                        <Icon icon="tabler:dots"></Icon>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <img :src="'data:image/png;base64,' + image" />
            </DialogContent>
        </Dialog>
    </div>
</template>
