<script setup lang="ts">
import DataTable from './table/DataTable.vue';
import { columns } from './table/columns';

export interface Dataset {
  name: string;
  tissue: string;
  disease: string;
  assay: string;
  organism: string;
  cells: string;
}

const datasets: Dataset[] = [{
    name: "Frozen samples (single nucleus)",
    tissue: "7 tissues",
    disease: "breast cancer",
    assay: "10x 3' v2",
    organism: "Homo sapiens",
    cells: "394,534",
},
{
    name: "Frozen samples (single nucleus)",
    tissue: "7 tissues",
    disease: "breast cancer",
    assay: "10x 3' v2",
    organism: "Homo sapiens",
    cells: "394,534",
}] 

</script>

<template>
    <div class="flex flex-col gap-6 items-center justify-center mt-20">
        <DataTable class="w-3/4" :columns="columns" :data="datasets" />
    </div>
</template>
