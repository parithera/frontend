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
    // set the dimensions and margins of the graph
    const margin = { top: 15, right: 70, bottom: 40, left: 30 },
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const axis_margin = 10;

    // append the svg object to the body of the page
    const svg = d3
        .select('.chart_' + props.chartId)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //Read the data
    const min_x_value = 0;
    const max_x_value = 50;
    const min_y_value = Math.min(...props.umapData);
    const max_y_value = Math.max(...props.umapData);

    // Add X axis
    const x = d3.scaleLinear().domain([min_x_value, max_x_value]).range([0, width]);

    svg.append('line')
        .attr('x1', -axis_margin)
        .attr('y1', 0)
        .attr('x2', -axis_margin)
        .attr('y2', height + axis_margin)
        .style('stroke', 'hsl(var(--primary))')
        .style('stroke-width', 1);

    svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height + 30)
        .text(props.xTitle);

    // Add Y axis
    const y = d3.scaleLinear().domain([min_y_value, max_y_value]).range([height, 0]);

    svg.append('line')
        .attr('x1', -axis_margin)
        .attr('y1', height + axis_margin)
        .attr('x2', width)
        .attr('y2', height + axis_margin)
        .style('stroke', 'hsl(var(--primary))')
        .style('stroke-width', 1);

    svg.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'middle')
        .attr('y', -30)
        .attr('x', -height / 2)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text(props.yTitle);

    // Add data
    svg
        .selectAll('texts')
        .data(props.umapData)
        .enter()
        .append('text')
        .attr('x', function (_, i) {
            return x(i);
        })
        .attr('y', function (d) {
            return y(d) - 6;
        })
        .attr('text-anchor', 'start')
        .style('font-size', '0.75rem')
        .attr('class', (_, i) => 'pca' + i)
        .style('display', 'none')
        .text((d, i) => 'PCA' + (i + 1) + ': ' + (d * 100).toFixed(2) + '%');

    svg
        .append('g')
        .selectAll('dot')
        .data(props.umapData)
        .join('circle')
        .attr('cx', function (_, i) {
            return x(i);
        })
        .attr('cy', function (d) {
            return y(d);
        })
        .attr('r', 3.5)
        .style('fill', 'hsl(var(--primary))')
        .attr('class', (_, i) => 'pca' + i + ' cursor-pointer')
        .on('mouseover', (event) => {
            svg.select('text.' + event.target.classList[0]).style('display', 'block');
        })
        .on('mouseout', (event) => {
            svg.select('text.' + event.target.classList[0]).style('display', 'none');
        });
}

onMounted(() => {
    drawChart();
});
</script>

<template>
    <div id="scatterChart" :class="'chart_' + chartId"></div>
</template>
