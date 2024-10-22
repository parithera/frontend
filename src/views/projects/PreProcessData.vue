<script setup lang="ts">
import Button from '@/shadcn/ui/button/Button.vue';
import Collapsible from '@/shadcn/ui/collapsible/Collapsible.vue';
import CollapsibleContent from '@/shadcn/ui/collapsible/CollapsibleContent.vue';
import CollapsibleTrigger from '@/shadcn/ui/collapsible/CollapsibleTrigger.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ChevronsUpDown } from 'lucide-vue-next';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import ScrollArea from '@/shadcn/ui/scroll-area/ScrollArea.vue';
import ScrollBar from '@/shadcn/ui/scroll-area/ScrollBar.vue';
import Dialog from '@/shadcn/ui/dialog/Dialog.vue';
import DialogTrigger from '@/shadcn/ui/dialog/DialogTrigger.vue';
import DialogContent from '@/shadcn/ui/dialog/DialogContent.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });
const svg_violin = defineModel<string>('svg_violin', { required: true });
const svg_variable_features = defineModel<string>('svg_variable_features', { required: true });
const svg_elbow = defineModel<string>('svg_elbow', { required: true });
const svg_umap = defineModel<string>('svg_umap', { required: true });

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
            } catch (__) {}
        }

        return ''; // use external default escaping
    }
});

const violin = `
\`\`\`R
seurat_object[["percent.mt"]] <- PercentageFeatureSet(object = seurat_object, pattern = "^MT-")
# Make violin plot, features = genes detected, counts = total molecules detected
VlnPlot(seurat_object, c("nCount_RNA", "nFeature_RNA", "percent.mt"), pt.size = 0.1, ncol = 3)
\`\`\`
`;
const variable_features = `
\`\`\`R
final_seurat_object <- NormalizeData(seurat_object, normalization.method = "LogNormalize", scale.factor = 10000)
# Find variable features
final_seurat_object <- FindVariableFeatures(final_seurat_object, selection.method = "vst", nfeatures = 2000)
# Identify the 10 most highly variable genes
top10 <- head(VariableFeatures(final_seurat_object), 10)
# Plot variable features with and without labels
plot_VFP <- VariableFeaturePlot(final_seurat_object)
plot_LP <- LabelPoints(plot = plot_VFP, points = top10, repel = TRUE)
plot_VFP + plot_LP
\`\`\`
`;
const elbow = `
\`\`\`R
final_seurat_object <- ScaleData(final_seurat_object)
# Regress out some parameters, like in this case the percentage of MT reads
final_seurat_object <- ScaleData(final_seurat_object, vars.to.regress = "percent.mt")
final_seurat_object <- RunPCA(final_seurat_object, features = VariableFeatures(object = final_seurat_object))
# Determine the dimensionality of the dataset
ElbowPlot(final_seurat_object)
\`\`\`
`;
const umap = `
\`\`\`R
# Using 16 PCs for clustering, as it seems to be the inflection point
final_seurat_object <- FindNeighbors(final_seurat_object, dims = 1:16)
final_seurat_object <- FindClusters(final_seurat_object, resolution = 0.5)
final_seurat_object <- RunUMAP(final_seurat_object, dims = 1:16)
DimPlot(final_seurat_object, reduction = "umap", label = TRUE)
\`\`\`
`;
</script>

<template>
    <Collapsible v-model:open="isOpen" class="space-y-2 flex flex-col items-center">
        <CollapsibleTrigger as-child>
            <div class="flex items-center justify-between space-x-4 px-4 w-fit">
                <h4
                    class="text-sm font-semibold6 cursor-pointer hover:bg-muted hover:rounded-md p-2"
                >
                    Show preprocessed data
                </h4>
                <Button variant="ghost" size="sm" class="w-9 p-0">
                    <ChevronsUpDown class="h-4 w-4" />
                    <span class="sr-only">Toggle</span>
                </Button>
            </div>
        </CollapsibleTrigger>
        <CollapsibleContent class="space-y-2 w-full">
            <div v-if="svg_violin != ''" class="flex flex-col items-center gap-2">
                <div class="flex flex-col w-full">
                    <Icon icon="carbon:logo-r-script"></Icon>
                    <ScrollArea>
                        <div
                            class="overflow-x-scroll"
                            id="markdown"
                            v-html="markdown.render(violin)"
                        ></div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <img
                            class="cursor-pointer w-1/2 hover:scale-105 hover:translate-y-1 transition duration-300 ease-in-out"
                            :src="'data:image/png;base64,' + svg_violin"
                        />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <img :src="'data:image/png;base64,' + svg_violin" />
                    </DialogContent>
                </Dialog>
            </div>

            <div v-if="svg_variable_features != ''" class="flex flex-col items-center gap-2">
                <div class="flex flex-col w-full">
                    <Icon icon="carbon:logo-r-script"></Icon>
                    <ScrollArea>
                        <div
                            class="overflow-x-scroll"
                            id="markdown"
                            v-html="markdown.render(variable_features)"
                        ></div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <img
                            class="cursor-pointer w-1/2 hover:scale-105 hover:translate-y-1 transition duration-300 ease-in-out"
                            :src="'data:image/png;base64,' + svg_variable_features"
                        />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <img :src="'data:image/png;base64,' + svg_variable_features" />
                    </DialogContent>
                </Dialog>
            </div>

            <div v-if="svg_elbow != ''" class="flex flex-col items-center gap-2">
                <div class="flex flex-col w-full">
                    <Icon icon="carbon:logo-r-script"></Icon>
                    <ScrollArea>
                        <div
                            class="overflow-x-scroll"
                            id="markdown"
                            v-html="markdown.render(elbow)"
                        ></div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <img
                            class="cursor-pointer w-1/2 hover:scale-105 hover:translate-y-1 transition duration-300 ease-in-out"
                            :src="'data:image/png;base64,' + svg_elbow"
                        />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <img :src="'data:image/png;base64,' + svg_elbow" />
                    </DialogContent>
                </Dialog>
            </div>

            <div v-if="svg_umap != ''" class="flex flex-col items-center gap-2">
                <div class="flex flex-col w-full">
                    <Icon icon="carbon:logo-r-script"></Icon>
                    <ScrollArea>
                        <div
                            class="overflow-x-scroll"
                            id="markdown"
                            v-html="markdown.render(umap)"
                        ></div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <img
                            class="cursor-pointer w-1/2 hover:scale-105 hover:translate-y-1 transition duration-300 ease-in-out"
                            :src="'data:image/png;base64,' + svg_umap"
                        />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <img :src="'data:image/png;base64,' + svg_umap" />
                    </DialogContent>
                </Dialog>
            </div>
        </CollapsibleContent>
    </Collapsible>
</template>
