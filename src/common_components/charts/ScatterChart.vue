<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted } from 'vue';

interface UMAPData {
    x: number;
    y: number;
    cluster: string;
    sample: string;
    marker_expression?: number;
}

const props = defineProps<{
    umap_data: Array<UMAPData>;
    chart_id: string;
    color_by: string;
    x_title: string;
    y_title: string;
}>();

function drawChart() {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 100, bottom: 30, left: 30 },
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
    const min_x_value = Math.min(...props.umap_data.map((item) => item.x));
    const max_x_value = Math.max(...props.umap_data.map((item) => item.x));
    const min_y_value = Math.min(...props.umap_data.map((item) => item.y));
    const max_y_value = Math.max(...props.umap_data.map((item) => item.y));

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

    let colors: Array<string> = [];
    if (props.color_by == 'sample') {
        colors = [...new Set(props.umap_data.map((item) => item.sample))];
    } else if (props.color_by == 'cluster') {
        colors = [...new Set(props.umap_data.map((item) => item.cluster))];
    }

    const color = d3.scaleOrdinal().domain(colors).range(d3.schemeTableau10);

    let min_expression_level = 0;
    let max_expression_level = 10;
    if (props.color_by == 'marker_expression') {
        min_expression_level = Math.min(
            ...props.umap_data.map((item) => item.marker_expression ?? 0)
        );
        max_expression_level = Math.max(
            ...props.umap_data.map((item) => item.marker_expression ?? 0)
        );
        console.log('min', min_expression_level);
        console.log('max', max_expression_level);
    }
    const linear_color = d3.scaleLinear(
        [min_expression_level, max_expression_level],
        ['lightgrey', 'red']
    );

    // Add dots
    const dots = svg
        .append('g')
        .selectAll('dot')
        .data(props.umap_data)
        .join('circle')
        .attr('cx', function (d) {
            return x(d.x);
        })
        .attr('cy', function (d) {
            return y(d.y);
        })
        .attr('r', 2.5)
        .attr('class', (d) => {
            if (props.color_by == 'sample') {
                return 'group_' + d.sample;
            } else if (props.color_by == 'cluster') {
                return 'group_' + d.cluster;
            } else if (props.color_by == 'marker_expression') {
                return 'group_' + d.marker_expression;
            } else {
                return 'black';
            }
        })
        .style('fill', (d) => {
            if (props.color_by == 'sample') {
                return color(d.sample);
            } else if (props.color_by == 'cluster') {
                return color(d.cluster);
            } else if (props.color_by == 'marker_expression') {
                return linear_color(d.marker_expression ?? 0);
            } else {
                return 'black';
            }
        });

    // Add legend
    svg.selectAll('legend')
        .data(colors)
        .enter()
        .append('text')
        .attr('class', 'cursor-pointer')
        .attr('text-anchor', 'start')
        .attr('x', width + 50)
        .attr('y', (d, i) => {
            return 15 + i * 20;
        })
        .text((d) => d)
        .on('mouseover', function (d, i) {
            dots.style('opacity', (d) => {
                if (d.sample == i || d.cluster == i) {
                    return '100%';
                } else {
                    return '10%';
                }
            });
        })
        .on('mouseout', function (d, i) {
            dots.style('opacity', '100%');
        });

    svg.append('g')
        .selectAll('dot')
        .data(colors)
        .join('circle')
        .attr('cx', width + 40)
        .attr('cy', (d, i) => {
            return 9 + i * 20;
        })
        .attr('r', 4)
        .style('fill', (d) => color(d));
}

onMounted(() => {
    drawChart();
});
</script>

<template>
    <div :class="'chart_' + chart_id"></div>
</template>
