<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQCStore } from '@/sockets/qc';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import { SampleRepository } from '@/views/samples/sample.repository';
import { Icon } from '@iconify/vue/dist/iconify.js';
import pako from 'pako';
import Button from '@/shadcn/ui/button/Button.vue';
import PCAChart from '@/common_components/charts/PCAChart .vue';
import ViolinChart from '@/common_components/charts/ViolinChart.vue';
import ScatterChart from '@/common_components/charts/ScatterChart.vue';
import VariableGenesChart from '@/common_components/charts/VariableGenesChart.vue';

const qcStore = useQCStore();
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

// Refs
const multiqc: Ref<string> = ref('');

const { pca_variance_ratio, violin_and_scatter_plot_data, highly_variable_genes_data, umap_data } = storeToRefs(qcStore);

async function fetchGraphs() {
    qcStore.$reset();
    qcStore.createSocket(authStore.getToken ?? '');
    // remove any existing listeners (after a hot module replacement)
    qcStore.getSocket.off();
    qcStore.bindEvents();
    qcStore.connect();

    const route = useRoute();

    qcStore.fetchData({
        sampleId: route.query.sampleId,
        orgId: userStore.defaultOrg?.id ?? ''
    });
}

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    await fetchGraphs();

    const res = await sampleRepository.getQC({
        bearerToken: authStore.getToken ?? '',
        orgId: userStore.defaultOrg?.id ?? '',
        sampleId: route.query.sampleId as string
    });

    // Use TextEncoder and TextDecoder instead of Buffer for browser compatibility
    const compressedData = Uint8Array.from(atob(res.data), c => c.charCodeAt(0));
    const decompressedData = pako.inflate(compressedData, { to: 'string' });
    multiqc.value = decompressedData;
});

function saveMultiQCReport() {
    const blob = new Blob([multiqc.value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multiqc_report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>

<template>
    <div class="flex justify-end">
        <Icon class="cursor-pointer m-4" width="1.5rem" icon="line-md:menu-to-close-transition"
            @click="() => router.back()" />
    </div>

    <div class="flex justify-center">
        <Button @click.prevent="saveMultiQCReport" class="rounded-full flex gap-2 items-center">
            <Icon icon="material-symbols:save-outline"></Icon> Save MultiQC Report
        </Button>
    </div>

    <div class="grid grid-cols-3 gap-y-10 items-end mx-20 py-10">
        <div class="flex flex-col items-center">
            <ViolinChart v-if="violin_and_scatter_plot_data && Object.keys(violin_and_scatter_plot_data).length > 0"
                :umap_data="violin_and_scatter_plot_data['n_genes_by_counts']" :chart_id="2" x_title="n_genes_by_counts"
                y_title="Variance ratio"></ViolinChart>
            <div class="font-bolder">Number of Genes</div>
            <span class="text-sm text-center">The number of genes with at least 1 count in a cell. Calculated for all
                cells.</span>
        </div>
        <div class="flex flex-col items-center">
            <ViolinChart v-if="violin_and_scatter_plot_data && Object.keys(violin_and_scatter_plot_data).length > 0"
                :umap_data="violin_and_scatter_plot_data['total_counts']" :chart_id="3" x_title="total_counts"
                y_title="Variance ratio"></ViolinChart>
            <div class="font-bolder">Total Counts</div>
            <span class="text-sm text-center">Total number of counts for a cell.</span>
        </div>
        <div class="flex flex-col items-center">
            <ViolinChart v-if="violin_and_scatter_plot_data && Object.keys(violin_and_scatter_plot_data).length > 0"
                :umap_data="violin_and_scatter_plot_data['pct_counts_mt']" :chart_id="4" x_title="pct_counts_mt"
                y_title="Variance ratio"></ViolinChart>
            <div class="font-bolder">Pct Counts MT</div>
            <span class="text-sm text-center">Proportion of total counts for a cell which are mitochondrial.</span>
        </div>
        <div class="flex flex-col items-center">
            <PCAChart v-if="pca_variance_ratio && Object.keys(pca_variance_ratio).length > 0"
                :umap_data="pca_variance_ratio['pca_variance_ratio']" :chart_id="1" x_title="Ranking 50"
                y_title="Variance ratio"></PCAChart>
            <div class="font-bolder">Principal Component Analysis (PCA)</div>
            <span class="text-sm text-center">Contribution of single PCs to the total variance in the data.</span>
        </div>
        <div class="flex flex-col items-center">
            <ScatterChart v-if="umap_data && Object.keys(umap_data).length > 0" chart_id="6"
                :umap_data="umap_data['data']" :color_by="'cluster'" x_title="UMAP1" y_title="UMAP2"></ScatterChart>
            <div class="font-bolder">Uniform Manifold Approximation and Projection (UMAP)</div>
            <span class="text-sm text-center">Dimensionality reduction in two dimensions for visualiztion with
                UMAP.</span>
        </div>
        <div class="flex flex-col items-center">
            <VariableGenesChart v-if="highly_variable_genes_data && Object.keys(highly_variable_genes_data).length > 0"
                :data="highly_variable_genes_data" :chart_id="5" x_title="mean expressions of genes"
                y_title="dispersions of genes"></VariableGenesChart>
            <div class="font-bolder">Feature Selection (Normalized)</div>
            <span class="text-sm text-center">Dimensionality reduction of the dataset and only include the most
                informative genes.</span>
        </div>
    </div>
</template>
