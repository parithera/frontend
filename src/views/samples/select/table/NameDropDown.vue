<script setup lang="ts">
import { Button } from '@/shadcn/ui/button';
import DropDownEdit from './DropDownEdit.vue';
import { Dialog, DialogTrigger } from '@/shadcn/ui/dialog';

const props = defineProps<{
    sample: {
        id: string;
        name: string;
        description: string;
        tags: string[];
    };
    name: string;
}>();
</script>

<template>
    <Dialog>
        <DialogTrigger>
            <Button variant="ghost">{{ props.name }} </Button>
        </DialogTrigger>
        <DropDownEdit :sample="props.sample" />
    </Dialog>
</template>
