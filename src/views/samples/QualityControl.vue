<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQCStore } from '@/sockets/qc';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import { SampleRepository } from '@/repositories/SampleRepository';
import { Icon } from '@iconify/vue/dist/iconify.js';
import pako from 'pako';
import Button from '@/shadcn/ui/button/Button.vue';
import PCAChart from '@/common_components/charts/PCAChart .vue';
import ViolinChart from '@/common_components/charts/ViolinChart.vue';

const qcStore = useQCStore();
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

// Refs
const multiqc: Ref<string> = ref('');

const { pca_variance_ratio, violin_and_scatter_plot_data } = storeToRefs(qcStore);

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

    <div class="flex gap-4 mx-20">
        <PCAChart v-if="pca_variance_ratio && Object.keys(pca_variance_ratio).length > 0"
            :umap_data="pca_variance_ratio['pca_variance_ratio']" :chart_id="1" x_title="Ranking 50"
            y_title="Variance ratio"></PCAChart>

        <ViolinChart v-if="violin_and_scatter_plot_data && Object.keys(violin_and_scatter_plot_data).length > 0"
            :umap_data="violin_and_scatter_plot_data['n_genes_by_counts']" :chart_id="1" x_title="Ranking 50"
            y_title="Variance ratio"></ViolinChart>

        <ViolinChart v-if="violin_and_scatter_plot_data && Object.keys(violin_and_scatter_plot_data).length > 0"
            :umap_data="violin_and_scatter_plot_data['total_counts']" :chart_id="1" x_title="Ranking 50"
            y_title="Variance ratio"></ViolinChart>

        <ViolinChart v-if="violin_and_scatter_plot_data && Object.keys(violin_and_scatter_plot_data).length > 0"
            :umap_data="violin_and_scatter_plot_data['pct_counts_mt']" :chart_id="1" x_title="Ranking 50"
            y_title="Variance ratio"></ViolinChart>

    </div>
</template>
