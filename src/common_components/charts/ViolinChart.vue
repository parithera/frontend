<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted } from 'vue';

const props = defineProps<{
    umapData: Array<number>;
    chartId: number;
    xTitle: string;
    yTitle: string;
}>();

function drawChart() {
    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };

    const svg = d3
        .select('.chart_' + props.chartId)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3
        .scaleLinear()
        .domain([d3.min(props.umapData), d3.max(props.umapData)])
        .range([height, 0]);

    const x = d3.scalePoint().range([0, width]).domain([props.xTitle]);

    // Updated: Use d3.bin instead of d3.histogram
    const bin = d3.bin().domain(y.domain()).thresholds(y.ticks(30));

    const bins = bin(props.umapData);

    // Calculate the maximum bin length for scaling
    const maxBinLength = d3.max(bins, (d) => d.length);

    // Scale for the width of the violin
    const xNum = d3
        .scaleLinear()
        .domain([0, maxBinLength])
        .range([0, width / 2]);

    const area = d3
        .area()
        .x0((d) => -xNum(d.length))
        .x1((d) => xNum(d.length))
        .y((d) => y(d.x0))
        .curve(d3.curveCatmullRom);

    svg.append('path')
        .datum(bins)
        .attr('fill', 'hsl(var(--secondary))')
        .attr('stroke', 'hsl(var(--primary))')
        .attr('stroke-width', 1)
        .attr('d', area)
        .attr('transform', `translate(${x(props.xTitle)},0)`);

    svg.append('g').call(d3.axisLeft(y));

    // Add x-axis
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
}

onMounted(() => {
    drawChart();
});
</script>

<template>
    <div :class="'chart_' + chartId"></div>
</template>
