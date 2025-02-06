<script setup lang="ts">
import Button from '@/shadcn/ui/button/Button.vue';
import Collapsible from '@/shadcn/ui/collapsible/Collapsible.vue';
import CollapsibleContent from '@/shadcn/ui/collapsible/CollapsibleContent.vue';
import CollapsibleTrigger from '@/shadcn/ui/collapsible/CollapsibleTrigger.vue';
import { ChevronsUpDown } from 'lucide-vue-next';
import ResponseCard from '@/views/projects/ReponseCard.vue';
import { storeToRefs } from 'pinia';
import { useConnectionStore } from '@/stores/connection';
import { Project } from '@/repositories/types/entities/Project';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { BusinessLogicError } from '@/repositories/BaseRepository';

const connectionStore = useConnectionStore();
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const projectRepository: ProjectRepository = new ProjectRepository();

const selected_project: Ref<Project> = ref(new Project());

const { svg_elbow, svg_umap, svg_violin, svg_variable_features } = storeToRefs(connectionStore);

async function fetchGraphs() {
    connectionStore.$reset;
    connectionStore.createSocket(authStore.getToken ?? '');
    // remove any existing listeners (after a hot module replacement)
    connectionStore.getSocket.off();
    connectionStore.bindEvents();
    connectionStore.connect();

    const route = useRoute()
    
    const graphs = ['pca_variance_ratio', 'violin', 'umap', 'filter_genes_dispersion'];
    for (const graph of graphs) {
        connectionStore.fetchGraphs({
            sampleId: route.query.sampleId,
            orgId: userStore.defaultOrg?.id ?? '',
            type: graph
        });
    }
}

const route = useRoute()
const router = useRouter()

onMounted(async ()=>{
await fetchGraphs()
})
</script>

<template>
    <Button class="rounded-full" @click="()=> router.back()">Go back</Button>
    <div class="flex flex-col items-center">

        {{ selected_project.name }}, {{ selected_project.added_on }}
        <img
            class="w-1/2"
            :src="'data:image/png;base64,' + svg_violin.trim()"
        />
        <img
            class="w-1/2"
            :src="'data:image/png;base64,' + svg_variable_features.trim()"
        />
        <img
            class="w-1/2"
            :src="'data:image/png;base64,' + svg_elbow.trim()"
        />
        <img
            class="w-1/2"
            :src="'data:image/png;base64,' + svg_umap.trim()"
        />
    </div>
</template>
