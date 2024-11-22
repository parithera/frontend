<script setup lang="ts">
import Button from '@/shadcn/ui/button/Button.vue';
import Collapsible from '@/shadcn/ui/collapsible/Collapsible.vue';
import CollapsibleContent from '@/shadcn/ui/collapsible/CollapsibleContent.vue';
import CollapsibleTrigger from '@/shadcn/ui/collapsible/CollapsibleTrigger.vue';
import { ChevronsUpDown } from 'lucide-vue-next';
import ResponseCard from '@/views/projects/ReponseCard.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });
const svg_violin = defineModel<string>('svg_violin', { required: true });
const svg_variable_features = defineModel<string>('svg_variable_features', { required: true });
const svg_elbow = defineModel<string>('svg_elbow', { required: true });
const svg_umap = defineModel<string>('svg_umap', { required: true });

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
            <Button variant="ghost" size="sm" class="flex gap-2 items-center rounded-full">
                <span> Show preprocessed data </span>
                <ChevronsUpDown class="h-4 w-4" />
                <span class="sr-only">Toggle</span>
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent class="flex flex-col gap-10 w-full">
            <ResponseCard
                v-if="svg_violin != ''"
                :markdown_content="violin"
                :image="svg_violin"
                :data="''"
                :text="''"
                :result="''"
                :code_visible="true"
                :id="1000"
            />

            <ResponseCard
                v-if="svg_variable_features != ''"
                :markdown_content="variable_features"
                :image="svg_variable_features"
                :data="''"
                :text="''"
                :result="''"
                :code_visible="true"
                :id="1001"
            />

            <ResponseCard
                v-if="svg_elbow != ''"
                :markdown_content="elbow"
                :image="svg_elbow"
                :data="''"
                :text="''"
                :result="''"
                :code_visible="true"
                :id="1002"
            />

            <ResponseCard
                v-if="svg_umap != ''"
                :markdown_content="umap"
                :image="svg_umap"
                :data="''"
                :text="''"
                :result="''"
                :code_visible="true"
                :id="1003"
            />
        </CollapsibleContent>
    </Collapsible>
</template>
