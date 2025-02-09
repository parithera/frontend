<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useConnectionStore } from '@/stores/connection';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import { SampleRepository } from '@/repositories/SampleRepository';
import { Icon } from '@iconify/vue/dist/iconify.js';
import pako from 'pako';
import Button from '@/shadcn/ui/button/Button.vue';

const connectionStore = useConnectionStore();
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

// Refs
const multiqc: Ref<string> = ref('');

const { svg_elbow, svg_umap, svg_violin, svg_variable_features } = storeToRefs(connectionStore);

async function fetchGraphs() {
    connectionStore.$reset();
    connectionStore.createSocket(authStore.getToken ?? '');
    // remove any existing listeners (after a hot module replacement)
    connectionStore.getSocket.off();
    connectionStore.bindEvents();
    connectionStore.connect();

    const route = useRoute();

    const graphs = ['pca_variance_ratio', 'violin', 'umap', 'filter_genes_dispersion'];
    for (const graph of graphs) {
        connectionStore.fetchGraphs({
            sampleId: route.query.sampleId,
            orgId: userStore.defaultOrg?.id ?? '',
            type: graph
        });
    }
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

    <div class="grid grid-cols-4 gap-y-12 mx-8 py-20">
        <div class="flex flex-col items-center">
            <img :src="'data:image/png;base64,' + svg_violin.trim()" style="width: 320px; height: 20em; object-fit: cover; object-position: 0 0;" />
            <div class="font-bolder">Number of Genes</div>
            <span class="text-sm text-center">The number of genes with at least 1 count in a cell. Calculated for all cells.</span>
        </div>
        <div class="flex flex-col items-center">
            <img :src="'data:image/png;base64,' + svg_violin.trim()" style="width: 300px; height: 20em; object-fit: cover; object-position: 47.8% 0;" />
            <div class="font-bolder">Total Counts</div>
            <span class="text-sm text-center">Total number of counts for a cell.</span>
        </div>
        <div class="flex flex-col items-center">
            <img :src="'data:image/png;base64,' + svg_violin.trim()" style="width: 300px; height: 20em; object-fit: cover; object-position: 95% 0;" />
            <div class="font-bolder">Pct Counts MT</div>
            <span class="text-sm text-center">Proportion of total counts for a cell which are mitochondrial.</span>
        </div>
        <div class="flex flex-col items-center">
            <img :src="'data:image/png;base64,' + svg_variable_features.trim()" style="width: 375px; height: 20em; object-fit: cover; object-position: 0 0;" />
            <div class="font-bolder">Feature Selection (Normalized)</div>
            <span class="text-sm text-center">Dimensionality reduction of the dataset and only include the most informative genes.</span>
        </div>
        <div class="flex flex-col items-center">
            <img :src="'data:image/png;base64,' + svg_variable_features.trim()" style="width: 375px; height: 20em; object-fit: cover; object-position: 100% 0;" />
            <div class="font-bolder">Feature Selection (Not Normalized)</div>
            <span class="text-sm text-center">Dimensionality reduction of the dataset and only include the most informative genes.</span>
        </div>
        <div class="flex flex-col items-center">
            <img :src="'data:image/png;base64,' + svg_elbow.trim()" style="width: 375px; height: 20em;"/>
            <div class="font-bolder">Principal Component Analysis (PCA)</div>
            <span class="text-sm text-center">Contribution of single PCs to the total variance in the data.</span>
        </div>
        <div class="flex flex-col items-center">
            <img :src="'data:image/png;base64,' + svg_umap.trim()" style="width: 375px; height: 20em;"/>
            <div class="font-bolder">Uniform Manifold Approximation and Projection (UMAP)</div>
            <span class="text-sm text-center">Dimensionality reduction in two dimensions for visualiztion with UMAP.</span>
        </div>
    </div>
</template>
