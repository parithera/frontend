<script lang="ts" setup>
import { Button } from '@/shadcn/ui/button';

import { useStateStore } from '@/stores/state';
import { useAuthStore } from '@/stores/auth';

import Card from '@/shadcn/ui/card/Card.vue';
import CardHeader from '@/shadcn/ui/card/CardHeader.vue';
import CardTitle from '@/shadcn/ui/card/CardTitle.vue';
import CardContent from '@/shadcn/ui/card/CardContent.vue';
import Input from '@/shadcn/ui/input/Input.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { FormField } from '@/shadcn/ui/form';
import FormItem from '@/shadcn/ui/form/FormItem.vue';
import FormControl from '@/shadcn/ui/form/FormControl.vue';
import FormDescription from '@/shadcn/ui/form/FormDescription.vue';
import FormMessage from '@/shadcn/ui/form/FormMessage.vue';
// import { toTypedSchema } from '@vee-validate/zod';
import { onMounted, ref, type Ref } from 'vue';
import { useForm } from 'vee-validate';
// import * as z from 'zod';
import { ChatRepository } from '@/repositories/ChatRepository';
// import ScatterChart from '@/common_components/charts/ScatterChart.vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import { FileRepository } from '@/repositories/FileRepository';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import Dialog from '@/shadcn/ui/dialog/Dialog.vue';
import DialogTrigger from '@/shadcn/ui/dialog/DialogTrigger.vue';
import DialogContent from '@/shadcn/ui/dialog/DialogContent.vue';
import DialogHeader from '@/shadcn/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/shadcn/ui/dialog/DialogTitle.vue';
import DialogDescription from '@/shadcn/ui/dialog/DialogDescription.vue';
import DialogFooter from '@/shadcn/ui/dialog/DialogFooter.vue';
import Label from '@/shadcn/ui/label/Label.vue';
import { useUserStore } from '@/stores/user';
import DialogClose from '@/shadcn/ui/dialog/DialogClose.vue';
import { Project } from '@/repositories/types/entities/Project';
import type { ProjectFile } from '@/repositories/types/entities/ProjectFile';
import Tabs from '@/shadcn/ui/tabs/Tabs.vue';
import TabsList from '@/shadcn/ui/tabs/TabsList.vue';
import TabsTrigger from '@/shadcn/ui/tabs/TabsTrigger.vue';
import TabsContent from '@/shadcn/ui/tabs/TabsContent.vue';
import Skeleton from '@/shadcn/ui/skeleton/Skeleton.vue';
import Switch from '@/shadcn/ui/switch/Switch.vue';
import Avatar from '@/shadcn/ui/avatar/Avatar.vue';
import AvatarImage from '@/shadcn/ui/avatar/AvatarImage.vue';
import AvatarFallback from '@/shadcn/ui/avatar/AvatarFallback.vue';
import VueMarkdown from 'vue-markdown-render';
import ResizablePanelGroup from '@/shadcn/ui/resizable/ResizablePanelGroup.vue';
import { ResizablePanel } from '@/shadcn/ui/resizable';
import ResizableHandle from '@/shadcn/ui/resizable/ResizableHandle.vue';
import Collapsible from '@/shadcn/ui/collapsible/Collapsible.vue';
import CollapsibleTrigger from '@/shadcn/ui/collapsible/CollapsibleTrigger.vue';
import { ChevronsUpDown } from 'lucide-vue-next';
import CollapsibleContent from '@/shadcn/ui/collapsible/CollapsibleContent.vue';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';

const state = useStateStore();
state.$reset();
state.page = 'dashboard';

// Repositories
const chatRepository: ChatRepository = new ChatRepository();
const fileRepository: FileRepository = new FileRepository();
const projectRepository: ProjectRepository = new ProjectRepository();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

let chat_content = ref([
    {
        request: '',
        response: 'Hi, how can I help you today?'
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
const svg_graph = ref('');
const loading = ref(false);
const isOpen = ref(false);

// const formSchema = toTypedSchema(
//     z.object({
//         request: z
//             .string()
//             .min(5, {
//                 message: 'Your request must be at least 5 characters.'
//             })
//             .max(160, {
//                 message: 'Your request must not be longer than 160 characters.'
//             })
//     })
// );

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
            projectId: selected_project.value.id,
            userId: userStore.user?.id ?? ''
        }
    });

    console.error(result.data);

    chat_content.value[chat_content.value.length - 1].response = result.data.answer;

    // Try to fetch graph every 5 seconds
    setInterval(() => {
        if (selected_project.value.id) {
            fetchChatGraph();
            return;
        }
    }, 5000);
}

const onFileSubmit = handleSubmit(async (values) => {
    const file: File = values.file as File;
    // const type: string = values.type as string;

    loading.value = true;
    await fileRepository.upload({
        bearerToken: authStore.getToken ?? '',
        data: {
            file: file,
            type: 'DATA'
        },
        projectId: selected_project.value.id
    });

    const project_retrieved = await projectRepository.getProjectById({
        bearerToken: authStore.getToken ?? '',
        projectId: selected_project.value.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    console.error(project_retrieved.data.files.length);

    let files_length = project_retrieved.data.files.length;

    while (files_length == 0) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.error('waiting');
        const project_retrieved = await projectRepository.getProjectById({
            bearerToken: authStore.getToken ?? '',
            projectId: selected_project.value.id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
        files_length = project_retrieved.data.files.length;
    }
    console.error('done waiting');

    const project_retrieved_2 = await projectRepository.getProjectById({
        bearerToken: authStore.getToken ?? '',
        projectId: selected_project.value.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    selected_project.value = project_retrieved_2.data;
    fetchGraphs(selected_project.value);
});

const submitForm = () => {
    window.document.getElementById('submitButton')?.click();
};

async function newProject() {
    chat_content.value = [
        {
            request: '',
            response: 'Hi, how can I help you today?'
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
    await projectRepository.deleteProject({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });
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
                loading.value = false;
                return;
            }
        }
        fetchGraphs(project);
    }
}

async function fetchGraphs(project: Project) {
    const elbow = await projectRepository.getSVGElbow({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_elbow.value = elbow.data;

    const umap = await projectRepository.getSVGUMAP({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_umap.value = umap.data;

    const variable_features = await projectRepository.getSVGVariableFeatures({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_variable_features.value = variable_features.data;

    const violin = await projectRepository.getSVGViolin({
        bearerToken: authStore.getToken ?? '',
        projectId: project.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_violin.value = violin.data;
    loading.value = false;
}

async function fetchChatGraph() {
    const graph = await projectRepository.getSVGGraph({
        bearerToken: authStore.getToken ?? '',
        projectId: selected_project.value.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });

    svg_graph.value = graph.data;
    loading.value = false;
}

async function deleteFile(file: ProjectFile) {
    await fileRepository.deleteFile({
        bearerToken: authStore.getToken ?? '',
        fileId: file.id,
        projectId: selected_project.value.id
    });

    const project_retrieved = await projectRepository.getProjectById({
        bearerToken: authStore.getToken ?? '',
        projectId: selected_project.value.id,
        orgId: userStore.defaultOrg?.id ?? ''
    });
    selected_project.value = project_retrieved.data;
}

function isOlderThanAWeek(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff > 7 * 24 * 60 * 60 * 1000;
}

onMounted(() => {
    getProjects();
});
</script>

<template>
    <div
        class="w-full flex flex-col gap-6 items-center justify-center mt-20"
        v-if="!selected_project.id"
    >
        <div class="text-2xl">Please select a project from the list or create a new one</div>
        <div class="w-1/4 flex flex-col items-center gap-2">
            <Dialog ref="dialog">
                <DialogTrigger as-child>
                    <Button class="flex items-center gap-2 rounded-full" variant="outline"
                        >+ Create a new project</Button
                    >
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create a new project</DialogTitle>
                        <DialogDescription>
                            Name your project and give it an optional description.
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="name" class="text-right"> Name </Label>
                            <Input
                                id="name"
                                placeholder="Breast cancer"
                                class="col-span-3"
                                v-model="new_project_name"
                                @keyup.enter="submitForm"
                            />
                        </div>
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="description" class="text-right"> Description </Label>
                            <Input
                                id="description"
                                placeholder="Breast cancer detection project."
                                class="col-span-3"
                                v-model="new_project_description"
                                @keyup.enter="submitForm"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose as-child>
                            <Button
                                class="rounded-full"
                                id="submitButton"
                                @click="newProject"
                                type="submit"
                            >
                                Create
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div class="mt-4">This week</div>
            <Button
                class="w-full rounded-full"
                v-for="project in projects"
                :key="project.id"
                :variant="isSelectedProject(project)"
                @click="selectOrUnselectProject(project)"
            >
                <div
                    class="flex items-center justify-between w-full gap-2"
                    v-if="!isOlderThanAWeek(new Date(project.imported_on))"
                >
                    {{ project.name }}
                    <Icon @click="deleteProject(project)" icon="iconoir:trash"></Icon>
                </div>
            </Button>
            <div class="mt-4">Older than a week</div>
            <div v-for="project in projects" :key="project.id">
                <Button
                    class="w-full rounded-full"
                    v-if="isOlderThanAWeek(new Date(project.imported_on))"
                    :variant="isSelectedProject(project)"
                    @click="selectOrUnselectProject(project)"
                >
                    <div class="flex items-center justify-between w-full gap-2">
                        {{ project.name }}
                        <Icon @click="deleteProject(project)" icon="iconoir:trash"></Icon>
                    </div>
                </Button>
            </div>
        </div>
    </div>

    <ResizablePanelGroup direction="horizontal" v-else>
        <ResizablePanel
            class="flex flex-col items-center p-6 py-8 h-[calc(100vh-4rem)] bg-secondary"
            :default-size="20"
        >
            <div class="flex flex-col gap-2">
                <div
                    v-if="selected_project.files.length == 0"
                    class="bg-secondary rounded flex justify-evenly p-2"
                >
                    <form class="flex flex-col gap-2 items-start" @submit="onFileSubmit">
                        <FormField v-slot="{ componentField }" name="file">
                            <FormItem>
                                <FormControl>
                                    <Input
                                        class="cursor-pointer"
                                        type="file"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormDescription>Upload your gene sequencing file.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <Button type="submit" class="flex gap-2 items-center w-full">
                            <Icon icon="bi:cloud-upload"></Icon> Upload
                        </Button>
                    </form>
                </div>
                <div v-else class="flex flex-col gap-2 items-center">
                    <span class="font-bold">File analyzed</span>
                    <div
                        v-for="file in selected_project.files"
                        :key="file.id"
                        class="flex w-full items-center gap-2 justify-between"
                    >
                        <Icon class="w-1/4" icon="tabler:file"></Icon>
                        <span class="w-1/2 text-wrap break-words"> {{ file.name }}</span
                        ><Icon
                            class="cursor-pointer w-1/4 text-destructive"
                            icon="iconoir:trash"
                            @click="deleteFile(file)"
                        ></Icon>
                    </div>
                </div>
            </div>
            <Separator class="my-4" />

            <Dialog ref="dialog">
                <DialogTrigger as-child>
                    <Button class="flex items-center gap-2 rounded-full" variant="outline"
                        >+ Create a new project</Button
                    >
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create a new project</DialogTitle>
                        <DialogDescription>
                            Name your project and give it an optional description.
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="name" class="text-right"> Name </Label>
                            <Input
                                id="name"
                                placeholder="Breast cancer"
                                class="col-span-3"
                                v-model="new_project_name"
                                @keyup.enter="submitForm"
                            />
                        </div>
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="description" class="text-right"> Description </Label>
                            <Input
                                id="description"
                                placeholder="Breast cancer detection project."
                                class="col-span-3"
                                v-model="new_project_description"
                                @keyup.enter="submitForm"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose as-child>
                            <Button
                                class="rounded-full"
                                id="submitButton"
                                @click="newProject"
                                type="submit"
                            >
                                Create
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div class="mt-4">This week</div>
            <Button
                class="w-full rounded-full"
                v-for="project in projects"
                :key="project.id"
                :variant="isSelectedProject(project)"
                @click="selectOrUnselectProject(project)"
            >
                <div
                    class="flex items-center justify-between w-full gap-2"
                    v-if="!isOlderThanAWeek(new Date(project.imported_on))"
                >
                    {{ project.name }}
                    <Icon @click="deleteProject(project)" icon="iconoir:trash"></Icon>
                </div>
            </Button>
            <div class="mt-4">Older than a week</div>
            <div v-for="project in projects" :key="project.id">
                <Button
                    class="w-full rounded-full"
                    v-if="isOlderThanAWeek(new Date(project.imported_on))"
                    :variant="isSelectedProject(project)"
                    @click="selectOrUnselectProject(project)"
                >
                    <div class="flex items-center justify-between w-full gap-2">
                        {{ project.name }}
                        <Icon @click="deleteProject(project)" icon="iconoir:trash"></Icon>
                    </div>
                </Button>
            </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel
            class="h-[calc(100vh-4rem)] p-8 flex flex-col items-center"
            :default-size="40"
        >
            <div v-if="loading" class="w-full flex flex-wrap gap-2 items-center justify-center">
                <div class="flex items-center w-1/2 text-2xl">
                    <Icon icon="eos-icons:loading"></Icon> We are processing your data...
                </div>
                <Skeleton class="h-12 w-1/2 rounded-full" />
                <Skeleton class="h-12 w-1/2 rounded-full" />
                <Skeleton class="h-12 w-1/2 rounded-full" />
            </div>

            <ScrollArea class="h-full w-full">
                <Collapsible v-model:open="isOpen" class="space-y-2 flex flex-col items-center">
                    <div class="flex items-center justify-between space-x-4 px-4 w-fit">
                        <h4 class="text-sm font-semibold6">Show preprocessed data</h4>
                        <CollapsibleTrigger as-child>
                            <Button variant="ghost" size="sm" class="w-9 p-0">
                                <ChevronsUpDown class="h-4 w-4" />
                                <span class="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent class="space-y-2">
                        <div v-if="svg_violin != ''">
                            <div class="bg-gray-100 p-2 rounded flex flex-col gap-1">
                                <Icon icon="carbon:logo-r-script"></Icon>
                                <span
                                    innerText='seurat_object[["percent.mt"]] <- PercentageFeatureSet(object = seurat_object, pattern = "^MT-")'
                                ></span>
                                <span
                                    class="text-gray-500"
                                    innerText="# Make violin plot, features = genes detected, counts = total molecules detected"
                                ></span>
                                <span
                                    innerText='VlnPlot(seurat_object, c("nCount_RNA", "nFeature_RNA", "percent.mt"), pt.size = 0.1, ncol = 3)'
                                ></span>
                            </div>
                            <td v-html="svg_violin"></td>
                        </div>

                        <div v-if="svg_variable_features != ''">
                            <div class="bg-gray-100 p-2 rounded flex flex-col gap-1">
                                <Icon icon="carbon:logo-r-script"></Icon>
                                <span
                                    innerText='sfinal_seurat_object <- NormalizeData(seurat_object, normalization.method = "LogNormalize", scale.factor = 10000)'
                                ></span>
                                <span
                                    class="text-gray-500"
                                    innerText="# Find variable features"
                                ></span>
                                <span
                                    innerText='final_seurat_object <- FindVariableFeatures(final_seurat_object, selection.method = "vst", nfeatures = 2000) '
                                ></span>
                                <span
                                    class="text-gray-500"
                                    innerText="# Identify the 10 most highly variable genes"
                                ></span>
                                <span
                                    innerText="top10 <- head(VariableFeatures(final_seurat_object), 10)"
                                ></span>
                                <span
                                    class="text-gray-500"
                                    innerText="# Plot variable features with and without labels"
                                ></span>
                                <span
                                    innerText="plot_VFP <- VariableFeaturePlot(final_seurat_object) "
                                ></span>

                                <span
                                    innerText="plot_LP <- LabelPoints(plot = plot_VFP, points = top10, repel = TRUE)"
                                ></span>
                                <span innerText="plot_VFP + plot_LP"></span>
                            </div>
                            <td v-html="svg_variable_features"></td>
                        </div>

                        <div v-if="svg_elbow != ''">
                            <div class="bg-gray-100 p-2 rounded flex flex-col gap-1">
                                <Icon icon="carbon:logo-r-script"></Icon>
                                <span
                                    innerText="final_seurat_object <- ScaleData(final_seurat_object)"
                                ></span>
                                <span
                                    class="text-gray-500"
                                    innerText="# Regress out some parameters, like in this case the percentage of MT reads"
                                ></span>
                                <span
                                    innerText='final_seurat_object <- ScaleData(final_seurat_object, vars.to.regress = "percent.mt")'
                                ></span>
                                <span
                                    innerText="final_seurat_object <- RunPCA(final_seurat_object, features = VariableFeatures(object = final_seurat_object))"
                                ></span>
                                <span
                                    class="text-gray-500"
                                    innerText="# Determine the dimensionality of the dataset"
                                ></span>
                                <span innerText="ElbowPlot(final_seurat_object)"></span>
                            </div>
                            <td v-html="svg_elbow"></td>
                        </div>

                        <div v-if="svg_umap != ''">
                            <div class="bg-gray-100 p-2 rounded flex flex-col gap-1">
                                <Icon icon="carbon:logo-r-script"></Icon>
                                <span
                                    class="text-gray-500"
                                    innerText="# Using 16 PCs for clustering, as it seems to be the inflection point"
                                ></span>
                                <span
                                    innerText="final_seurat_object <- FindNeighbors(final_seurat_object, dims = 1:16)"
                                ></span>
                                <span
                                    innerText="final_seurat_object <- FindClusters(final_seurat_object, resolution = 0.5)"
                                ></span>
                                <span
                                    innerText="final_seurat_object <- RunUMAP(final_seurat_object, dims = 1:16)"
                                ></span>
                                <span class="text-gray-500" innerText="# Plot the results"></span>
                                <span
                                    innerText='DimPlot(final_seurat_object, reduction = "umap", label = TRUE)'
                                ></span>
                            </div>
                            <td v-html="svg_umap"></td>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div class="flex flex-col gap-4">
                    <div
                        class="hover:bg-muted p-2 rounded"
                        v-for="(chat_element, index) in chat_content"
                        :key="index"
                    >
                        <div v-if="chat_element.request != ''" class="flex flex-col">
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
                                <div>You :</div>
                            </div>
                            <div class="pl-4">{{ chat_element.request }}</div>
                        </div>
                        <div>
                            <div class="font-semibold flex gap-1 items-center">
                                <img src="@/imgs/logos/logo.svg" class="w-8 self-center" />
                                <div>ExPlore :</div>
                            </div>
                            <div class="pl-4">
                                <VueMarkdown :source="chat_element.response" />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </ResizablePanel>
        <ResizableHandle v-if="svg_graph != ''" with-handle />
        <ResizablePanel v-if="svg_graph != ''" :default-size="40">
            <td v-html="svg_graph"></td>
        </ResizablePanel>
    </ResizablePanelGroup>
    <form v-if="selected_project.id" class="w-1/2 left-1/4 bottom-6 fixed" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="request">
            <FormItem>
                <!-- <FormLabel>Bio</FormLabel> -->
                <FormControl>
                    <div class="relative flex items-center">
                        <Input
                            placeholder="Tell ExPlore what graph you want to generate..."
                            class="resize-none rounded-full pl-2 py-7 box-border h-6 w-full"
                            v-bind="componentField"
                            @keyup.enter="onSubmit"
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
