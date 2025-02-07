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
    <div class="flex">
        <Icon class="cursor-pointer m-2" icon="line-md:menu-to-close-transition" @click="() => router.back()" />
    </div>
    
    <a href="#" @click.prevent="saveMultiQCReport" class="mt-4 text-blue-500 underline">Save MultiQC Report</a>

    <div class="flex flex-wrap">
        <img :src="'data:image/png;base64,' + svg_violin.trim()" />
        <img class="w-1/2" :src="'data:image/png;base64,' + svg_variable_features.trim()" />
        <img class="w-1/4" :src="'data:image/png;base64,' + svg_elbow.trim()" />
        <img class="w-1/4" :src="'data:image/png;base64,' + svg_umap.trim()" />
    </div>
</template>
