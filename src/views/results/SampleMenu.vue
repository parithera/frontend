<script lang="ts" setup>
import type { Sample } from '@/repositories/types/entities/Sample';
import Button from '@/shadcn/ui/button/Button.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

defineProps<{
    sample: Sample;
}>();

</script>

<template>
    <div class="flex gap-2 flex-wrap items-center justify-center">
            <Icon width="0.5rem" icon="tabler:circle-filled"></Icon>
            {{ sample.name }}
            <RouterLink :to="{ name: 'samples', params: { page: 'qc' }, query: { sampleId: sample.id } }">
                <Button class="text-primary" variant="ghost">🔎 Show QC</Button>
            </RouterLink>
        
    </div>
</template>