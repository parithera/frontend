<script lang="ts" setup>
import type { Sample } from '@/views/samples/sample.entity';
import Button from '@/shadcn/ui/button/Button.vue';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import TooltipContent from '@/shadcn/ui/tooltip/TooltipContent.vue';

defineProps<{
    sample: Sample;
}>();

function shortenName(name: string) {
    if (name.length > 20) {
        return name.substring(0, 16) + '...';
    }
    return name;
}
</script>

<template>
    <div class="flex gap-2 flex-wrap items-center justify-center">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger as-child>
                    <span class="cursor-pointer">{{ shortenName(sample.name) }}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{{ sample.name }}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <a v-if="sample.show != ''" :href="sample.show">
            <!-- <Button class="text-primary" variant="ghost">Explore</Button> -->
        </a>
        <RouterLink
            v-else-if="sample.type == 'fastq'"
            :to="{ name: 'samples', params: { page: 'qc' }, query: { sampleId: sample.id } }"
        >
            <Button class="text-primary" variant="ghost">Show QC</Button>
        </RouterLink>
    </div>
</template>
