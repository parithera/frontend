<script lang="ts" setup>
import Button from '@/shadcn/ui/button/Button.vue';
import type { ModelRef } from 'vue';

const loading: ModelRef<boolean> = defineModel('loading', { required: true });
const configure_analysis: ModelRef<boolean> = defineModel('configure_analysis', { required: true });
</script>
<template>
    You need to configure the analysis
    <div class="flex gap-4">
        <Button @click="configure_analysis = false">Previous</Button>
        <Button @click="loading = true">Next</Button>
    </div>
</template>