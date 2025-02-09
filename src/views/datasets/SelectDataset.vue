<script setup lang="ts">
import DataTable from './table/DataTable.vue';
import { columns } from './table/columns';

export interface Dataset {
    name: string;
    disease: string;
    platform: string;
    organism: string;
    reads: string;
    study: string;
    explore: string;
}

const datasets: Dataset[] = [{
    name: "Breast Cancer RNA-Seq (SRR24415332)",
    disease: "Breast Cancer",
    platform: "Illumina",
    organism: "Homo sapiens",
    reads: "29,956,708",
    study: "https://trace.ncbi.nlm.nih.gov/Traces/?view=study&acc=SRP435680",
    explore: "https://trace.ncbi.nlm.nih.gov/Traces/?view=run_browser&page_size=10&acc=SRR24415332&display=metadata"
},
{
    name: "RNA-Seq of mus musculus: tumor (SRR32254714)",
    disease: "Lung Cancer",
    platform: "Illumina",
    organism: "Mus Musculus",
    reads: "24,059,741",
    study: "https://trace.ncbi.nlm.nih.gov/Traces/?view=study&acc=SRP561972",
    explore: "https://trace.ncbi.nlm.nih.gov/Traces/?view=run_browser&acc=SRR32254714&display=metadata"
}]

</script>

<template>
    <div class="flex flex-col gap-6 items-center justify-center mt-20">
        <DataTable class="w-3/4" :columns="columns" :data="datasets" />
    </div>
</template>
