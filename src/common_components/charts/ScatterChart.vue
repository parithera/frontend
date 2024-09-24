<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted, toRef, watch } from 'vue';
import { type ChartData } from '@/repositories/ChatRepository';

export interface Props {
    chartData: ChartData;
}

const props = defineProps<Props>();

const dataCopy = toRef(props, 'chartData');

function drawChart() {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
        .select('.scatterChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //Read the data
    const min_x_value = Math.min(...dataCopy.value.data.map((item) => item.x));
    const max_x_value = Math.max(...dataCopy.value.data.map((item) => item.x));
    const min_y_value = Math.min(...dataCopy.value.data.map((item) => item.y));
    const max_y_value = Math.max(...dataCopy.value.data.map((item) => item.y));

    // Add X axis
    const x = d3.scaleLinear().domain([min_x_value, max_x_value]).range([0, width]);
    svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear().domain([min_y_value, max_y_value]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));

    const colors = [...new Set(dataCopy.value.data.map((item) => item.color))];
    const color = d3.scaleOrdinal().domain(colors).range(d3.schemeSet3);

    // Add dots
    svg.append('g')
        .selectAll('dot')
        .data(dataCopy.value.data)
        .join('circle')
        .attr('cx', function (d) {
            return x(d.x);
        })
        .attr('cy', function (d) {
            return y(d.y);
        })
        .attr('r', 1.5)
        .style('fill', (d) => color(d.color));
}

watch(dataCopy.value, () => {
    drawChart();
});

onMounted(() => {
    drawChart();
});
</script>
<template>
    <div>
        <div if="scatterChart" class="scatterChart"></div>
    </div>
</template>

<style>
.area {
    fill: hsla(185, 100%, 28%, 0.449);
}
</style>

<style>
.scatterChart .tooltip {
    background-color: white;
    padding: 0px 5px;
    border: 1px solid #008491;
    border-radius: 5px;
}
</style>
