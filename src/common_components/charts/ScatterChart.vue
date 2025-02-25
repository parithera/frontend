<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted } from 'vue';

interface UMAPData {
    x: number;
    y: number;
    cluster: string;
    sample: string
}

const props = defineProps<{
    umap_data: Array<UMAPData>,
    chart_id: number,
    color_by: string
}>();

function drawChart() {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 100, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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
    // svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
    // svg.append("text")
    // .attr("class", "x label")
    // .attr("text-anchor", "end")
    // .attr("x", width)
    // .attr("y", height + 20)
    // .text("UMAP1");

    // Add Y axis
    const y = d3.scaleLinear().domain([min_y_value, max_y_value]).range([height, 0]);
    // svg.append('g').call(d3.axisLeft(y));
    // svg.append("text")
    // .attr("class", "y label")
    // .attr("text-anchor", "end")
    // .attr("y", 6)
    // .attr("x", -20)
    // .attr("dy", ".75em")
    // .attr("transform", "rotate(-90)")
    // .text("UMAP2");

    let colors: Array<string> = []
    if (props.color_by == 'sample') {
        colors = [...new Set(props.umap_data.map((item) => item.sample))];
    } else {
        colors = [...new Set(props.umap_data.map((item) => item.cluster))];
    }
    const color = d3.scaleOrdinal().domain(colors).range(d3.schemeTableau10);

    // Add legend
    svg.
        selectAll("text")
        .data(colors)
        .enter()
        .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "start")
        .attr("x", width + 50)
        .attr("y", (d, i) => { return 15 + i * 20 })
        .text((d) => d);

    svg.append('g')
        .selectAll('dot')
        .data(colors)
        .join('circle')
        .attr("cx", width + 40)
        .attr("cy", (d, i) => { return 9 + i * 20 })
        .attr('r', 4)
        .style('fill', (d) => color(d));

    // Add dots
    svg.append('g')
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
        .style('fill', (d) => {
            if (props.color_by == 'sample') return color(d.sample)
           return  color(d.cluster)
        });
}

onMounted(() => {
    drawChart();
});
</script>

<template>
    <div id="scatterChart" :class="'chart_' + chart_id"></div>
</template>