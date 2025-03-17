<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted } from 'vue';

export interface VariableChartData {
    highly_variable: Array<boolean>;
    dispersions: Array<number>;
    means: Array<number>;
}

const props = defineProps<{
    data: VariableChartData;
    chart_id: number;
    x_title: string;
    y_title: string;
}>();

function drawChart() {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 40, left: 30 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const axis_margin = 10;

    // append the svg object to the body of the page
    const svg = d3
        .select('.chart_' + props.chart_id)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //Read the data
    const min_x_value = Math.min(...props.data.means);
    const max_x_value = Math.max(...props.data.means);
    const min_y_value = Math.min(...props.data.dispersions);
    const max_y_value = Math.max(...props.data.dispersions);

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
        .text(props.x_title);

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
        .text(props.y_title);

    const color = d3.scaleOrdinal().domain(['false', 'true']).range(d3.schemeTableau10);

    // Add dots
    const dots = svg
        .append('g')
        .selectAll('dot')
        .data(props.data.means)
        .join('circle')
        .attr('cx', function (d) {
            return x(d);
        })
        .attr('cy', function (_, i) {
            return y(props.data.dispersions[i]);
        })
        .attr('r', 2.5)
        .attr('class', (d, i) => {
            return 'group_' + i;
        })
        .style('fill', (_, i) => {
            if (props.data.highly_variable[i]) return color('true');
            return color('false');
        });
}

onMounted(() => {
    drawChart();
});
</script>

<template>
    <div :class="'chart_' + chart_id"></div>
</template>
