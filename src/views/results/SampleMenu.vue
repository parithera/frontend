<script lang="ts" setup>
import type { Sample } from '@/repositories/types/entities/Sample';
import Button from '@/shadcn/ui/button/Button.vue';

defineProps<{
    sample: Sample;
}>();

</script>

<template>
    <div class="flex flex-wrap items-center justify-center">
        
            {{ sample.name }}
            <RouterLink :to="{ name: 'samples', params: { page: 'qc' }, query: { sampleId: sample.id } }">
                <Button variant="ghost">🔎 Show QC</Button>
            </RouterLink>
        
    </div>
</template>