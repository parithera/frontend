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
import { computed, ref, type Ref } from 'vue';
import type { ChatContent, JSONScatter, JSONUMAP } from './types';
import FailedCard from './FailedCard.vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import { Progress } from '@/shadcn/ui/progress';
import ScatterChart from '@/common_components/charts/ScatterChart.vue';

const props = defineProps<{
    response: ChatContent;
    id: number;
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
            } catch (error) {
                console.log('error hljs', error);
            }
        }

        return ''; // use external default escaping
    }
});

const icon: Ref<string> = ref('octicon:paste-24');
const icon_image: Ref<string> = ref('octicon:paste-24');
const code_visible: Ref<boolean> = ref(false);

function copy() {
    navigator.clipboard.writeText(props.response.text);
    icon.value = 'tabler:check';
}
async function copyImage() {
    const makeImagePromise = async () => {
        const fetchedImageData = await fetch('data:image/png;base64,' + props.response.image);
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

function askFollowup(followup: string) {
    (document.getElementById('chat_bar') as HTMLInputElement).value = followup;
    // (document.getElementById('chat_submit') as HTMLButtonElement).click()
}

const progress = computed(() => {
    switch (props.response.status) {
        case 'starting':
            return 10;
        case 'agent_chosen':
            return 20;
        case 'llm_answer_received':
            return 45;
        case 'code_ready':
            return 50;
        case 'script_started':
            return 60;
        case 'script_executed':
            return 90;
        default:
            return 0;
    }
});
</script>

<template>
    <div
        v-if="
            ['starting', 'agent_chosen', 'llm_answer_received'].includes(response.status) &&
            !response.text.includes('Hi, how can I help you today?')
        "
        class="flex flex-col items-center"
    >
        <Progress v-model="progress" class="w-1/2"></Progress>
    </div>
    <div v-else class="flex flex-col items-center gap-2">
        <!-- ERROR -->
        <template v-if="response.error.length != 0">
            <FailedCard></FailedCard>
        </template>

        <template v-else>
            <!-- TEXT -->
            <div v-if="response.text != ''" class="self-start">
                <ScrollArea>
                    <div
                        class="overflow-x-scroll pl-10 pb-3 markdown"
                        v-html="markdown.render(response.text)"
                    ></div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div
                    v-if="!response.text.includes('Hi, how can I help you today?')"
                    class="flex justify-between px-4"
                >
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
                        <Button class="rounded-full" variant="ghost" size="sm" @click="copy">
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

            <!-- PROGRESS -->
            <div
                v-if="
                    response.status != 'done' &&
                    !response.text.includes('Hi, how can I help you today?')
                "
                class="flex flex-col gpa-2 items-center w-1/2"
            >
                <span class="flex gap-2 items-center">
                    <Icon class="animate-spin" icon="tabler:loader-2"></Icon> Executing your script
                </span>
                <Progress v-model="progress"></Progress>
            </div>

            <!-- DATA -->
            <div v-if="response.json && Object.keys(response.json).length !== 0">
                <!-- {{ response.json }} -->
                <ScatterChart
                    v-if="response.json['type'] == 'umap'"
                    :chart-id="props.id.toString()"
                    :umap-data="(response.json as JSONUMAP).data"
                    :color-by="'sample'"
                    x-title="UMAP1"
                    y-title="UMAP2"
                >
                </ScatterChart>
                <ScatterChart
                    v-else-if="response.json['type'] == 'tsne'"
                    :chart-id="props.id.toString()"
                    :umap-data="(response.json as JSONUMAP).data"
                    :color-by="'sample'"
                    x-title="tSNE1"
                    y-title="tSNE2"
                >
                </ScatterChart>
                <ScatterChart
                    v-else-if="
                        response.json['type'] == 'cluster' || response.json['type'] == 'leiden'
                    "
                    :chart-id="props.id.toString()"
                    :umap-data="(response.json as JSONUMAP).data"
                    :color-by="'cluster'"
                    x-title="UMAP1"
                    y-title="UMAP2"
                ></ScatterChart>
                <div
                    v-else-if="response.json['type'] == 'marker'"
                    class="grid grid-cols-2 gap-y-10"
                >
                    <div
                        v-for="gene in Object.keys((response.json as JSONScatter).data.umaps)"
                        :key="gene"
                        class="flex flex-col items-center gap-2"
                    >
                        <span>Expression level for : {{ gene }}</span>
                        <ScatterChart
                            :chart-id="props.id + gene"
                            :umap-data="(response.json as JSONScatter).data.umaps.gene"
                            :color-by="'marker_expression'"
                            x-title="UMAP1"
                            y-title="UMAP2"
                        ></ScatterChart>
                    </div>
                </div>
            </div>
            <!-- IMAGE -->
            <Dialog v-else-if="response.image != ''">
                <DialogTrigger as-child>
                    <FailedCard
                        v-if="
                            response.image ==
                            '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'
                        "
                    ></FailedCard>
                    <img
                        v-else-if="response.image != ''"
                        class="cursor-pointer w-1/3 hover:scale-105 hover:translate-y-2 transition duration-300 ease-in-out"
                        :src="'data:image/png;base64,' + response.image.trim()"
                    />
                    <div v-if="response.image != ''" class="flex items-center gap-2">
                        <Button class="rounded-full" variant="ghost" size="sm" @click="copyImage">
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
                    <img :src="'data:image/png;base64,' + response.image" />
                </DialogContent>
            </Dialog>

            <!-- CODE -->
            <Button
                v-if="response.code != ''"
                variant="link"
                @click="code_visible = !code_visible"
                >{{ code_visible ? 'Hide Code' : 'Show Code' }}</Button
            >
            <ScrollArea v-if="response.code != '' && code_visible" class="w-full">
                <div v-html="markdown.render('```python' + response.code + '```')"></div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Button
                v-if="response.code != '' && code_visible"
                variant="link"
                @click="code_visible = !code_visible"
            >
                {{ code_visible ? 'Hide Code' : 'Show Code' }}
            </Button>

            <!-- FOLLOW-UP -->
            <!-- <div v-if="response.followup.length" class="flex flex-col w-full pl-10 pr-4">
                <div class="pb-4 font-semibold">Follow-Up Questions</div>
                <Separator></Separator>
                <div
                    v-for="followup in response.followup"
                    :key="followup"
                    class="flex flex-col gap-2 pt-2"
                >
                    <div class="cursor-pointer" @click="askFollowup(followup)">{{ followup }}</div>
                    <Separator></Separator>
                </div>
            </div> -->
        </template>
    </div>
</template>

<style lang="scss">
.markdown {
    h1 {
        font-size: xx-large;
        font-weight: 900;
        padding-top: 20px;
    }

    h2 {
        font-size: x-large;
        font-weight: 700;
        padding-top: 20px;
    }

    h3 {
        font-size: large;
        font-weight: 700;
        padding-top: 20px;
    }

    h4 {
        font-size: medium;
        font-weight: 700;
        padding-top: 20px;
    }

    h5 {
        font-weight: 700;
        padding-top: 20px;
    }

    h6 {
        font-weight: 700;
        padding-top: 20px;
    }

    ol li {
        list-style-type: upper-roman;
        margin-left: 2rem;
    }

    p {
        padding-top: 1rem;
    }

    a {
        color: hsl(var(--primary));
        font-weight: bolder;
    }
}
</style>
