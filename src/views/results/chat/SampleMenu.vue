<script lang="ts" setup>
import type { Sample } from '@/repositories/types/entities/Sample';
import Button from '@/shadcn/ui/button/Button.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

defineProps<{
    sample: Sample;
}>();

function shortenName(name: string) {
    if (name.length > 8) {
        return name.substring(0, 6) + '...';
    }
    return name
}
</script>

<template>
    <div class="flex gap-2 flex-wrap items-center justify-center">
        <Icon width="0.5rem" icon="tabler:circle-filled"></Icon>
        {{ shortenName(sample.name) }}
        <a v-if="sample.show != ''" :href="sample.show">
            <Button class="text-primary" variant="ghost">Explore</Button>
        </a>
        <RouterLink v-else :to="{ name: 'samples', params: { page: 'qc' }, query: { sampleId: sample.id } }">
            <Button class="text-primary" variant="ghost">Show QC</Button>
        </RouterLink>
    </div>
</template>