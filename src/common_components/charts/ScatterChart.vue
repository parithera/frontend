<script lang="ts" setup>
import { Button } from '@/shadcn/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import TooltipContent from '@/shadcn/ui/tooltip/TooltipContent.vue';
import { Icon } from '@iconify/vue';
import * as d3 from 'd3';
import { onMounted } from 'vue';

export interface UMAPData {
    x: number;
    y: number;
    cluster: string;
    sample: string;
    marker_expression?: number;
}

const props = defineProps<{
    umapData: Array<UMAPData>;
    chartId: string;
    colorBy: string;
    xTitle: string;
    yTitle: string;
}>();

function drawChart() {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 100, bottom: 30, left: 30 },
        width = 460 - margin.left - margin.right,
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
    const min_x_value = Math.min(...props.umapData.map((item) => item.x));
    const max_x_value = Math.max(...props.umapData.map((item) => item.x));
    const min_y_value = Math.min(...props.umapData.map((item) => item.y));
    const max_y_value = Math.max(...props.umapData.map((item) => item.y));

    // Add X axis
    const x = d3.scaleLinear().domain([min_x_value, max_x_value]).range([0, width]);

    svg.append('line')
        .attr('x1', -axis_margin)
        .attr('y1', 0)
        .attr('x2', -axis_margin)
        .attr('y2', height + axis_margin)
        .style('stroke', 'hsl(191 89% 18%)')
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
        .style('stroke', 'hsl(191 89% 18%)')
        .style('stroke-width', 1);

    svg.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'middle')
        .attr('y', -30)
        .attr('x', -height / 2)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text(props.yTitle);

    let colors: Array<string> = [];
    if (props.colorBy == 'sample') {
        colors = [...new Set(props.umapData.map((item) => item.sample))];
    } else if (props.colorBy == 'cluster') {
        colors = [...new Set(props.umapData.map((item) => item.cluster))];
    }

    const color: Function = d3.scaleOrdinal().domain(colors).range(d3.schemeTableau10);

    let min_expression_level = 0;
    let max_expression_level = 10;
    if (props.colorBy == 'marker_expression') {
        min_expression_level = Math.min(
            ...props.umapData.map((item) => item.marker_expression ?? 0)
        );
        max_expression_level = Math.max(
            ...props.umapData.map((item) => item.marker_expression ?? 0)
        );
        console.log('min', min_expression_level);
        console.log('max', max_expression_level);
    }
    const linear_color: Function = d3.scaleLinear(
        [min_expression_level, max_expression_level],
        ['lightgrey', 'red']
    );

    // Add dots
    const dots = svg
        .append('g')
        .selectAll('dot')
        .data(props.umapData)
        .join('circle')
        .attr('cx', function (d) {
            return x(d.x);
        })
        .attr('cy', function (d) {
            return y(d.y);
        })
        .attr('r', 2.5)
        .attr('class', (d) => {
            if (props.colorBy == 'sample') {
                return 'group_' + d.sample;
            } else if (props.colorBy == 'cluster') {
                return 'group_' + d.cluster;
            } else if (props.colorBy == 'marker_expression') {
                return 'group_' + d.marker_expression;
            } else {
                return 'black';
            }
        })
        .style('fill', (d) => {
            if (props.colorBy == 'sample') {
                return color(d.sample);
            } else if (props.colorBy == 'cluster') {
                return color(d.cluster);
            } else if (props.colorBy == 'marker_expression') {
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
        .attr('y', (_, i) => {
            return 15 + i * 20;
        })
        .text((d) => d)
        .on('mouseover', function (_, i) {
            dots.style('opacity', (d) => {
                if (d.sample == i || d.cluster == i) {
                    return '100%';
                } else {
                    return '10%';
                }
            });
        })
        .on('mouseout', function () {
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

    document.getElementById('download_' + props.chartId)?.addEventListener('click', function () {
        // Replace chartId with the actual value or variable
        const chartId = props.chartId;
        const chartDiv = document.querySelector('.chart_' + chartId);
        if (!chartDiv) {
            alert('Chart not found!');
            return;
        }
        const svg = chartDiv.querySelector('svg');
        if (!svg) {
            alert('SVG not found in chart!');
            return;
        }
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);

        // Ensure SVG namespace is present
        if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'graph.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});
</script>

<template>
    <div :class="'chart_' + chartId"></div>
    <div class="flex justify-center gap-2 pt-4">
        <Button :id="'download_' + chartId" class="rounded-full" variant="ghost" size="sm">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger class="flex items-center gap-2">
                        <Icon icon="octicon:download-24"></Icon>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Button>
        <!-- <Button class="rounded-full" variant="ghost" size="sm">
             <Icon icon="tabler:dots"></Icon>
         </Button> -->
    </div>
</template>
