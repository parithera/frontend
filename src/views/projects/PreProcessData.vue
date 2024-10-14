<script setup lang="ts">
import Button from '@/shadcn/ui/button/Button.vue';
import Collapsible from '@/shadcn/ui/collapsible/Collapsible.vue';
import CollapsibleContent from '@/shadcn/ui/collapsible/CollapsibleContent.vue';
import CollapsibleTrigger from '@/shadcn/ui/collapsible/CollapsibleTrigger.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ChevronsUpDown } from 'lucide-vue-next';

const isOpen = defineModel<boolean>('isOpen', { required: true });
const svg_violin = defineModel<string>('svg_violin', { required: true });
const svg_variable_features = defineModel<string>('svg_variable_features', { required: true });
const svg_elbow = defineModel<string>('svg_elbow', { required: true });
const svg_umap = defineModel<string>('svg_umap', { required: true });
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
                <div v-html="svg_violin"></div>
            </div>

            <div v-if="svg_variable_features != ''">
                <div class="bg-gray-100 p-2 rounded flex flex-col gap-1">
                    <Icon icon="carbon:logo-r-script"></Icon>
                    <span
                        innerText='sfinal_seurat_object <- NormalizeData(seurat_object, normalization.method = "LogNormalize", scale.factor = 10000)'
                    ></span>
                    <span class="text-gray-500" innerText="# Find variable features"></span>
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
                    <span innerText="plot_VFP <- VariableFeaturePlot(final_seurat_object) "></span>

                    <span
                        innerText="plot_LP <- LabelPoints(plot = plot_VFP, points = top10, repel = TRUE)"
                    ></span>
                    <span innerText="plot_VFP + plot_LP"></span>
                </div>
                <div v-html="svg_variable_features"></div>
            </div>

            <div v-if="svg_elbow != ''">
                <div class="bg-gray-100 p-2 rounded flex flex-col gap-1">
                    <Icon icon="carbon:logo-r-script"></Icon>
                    <span innerText="final_seurat_object <- ScaleData(final_seurat_object)"></span>
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
                <div v-html="svg_elbow"></div>
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
                <div v-html="svg_umap"></div>
            </div>
        </CollapsibleContent>
    </Collapsible>
</template>
