<script setup lang="ts">
import { BusinessLogicError } from '@/types/BaseRepository';
import { SampleRepository } from '@/views/samples/sample.repository';
import router from '@/router';
import { Button } from '@/shadcn/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/shadcn/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue/dist/iconify.js';
import DropDownEdit from './DropDownEdit.vue';
import { Dialog, DialogTrigger } from '@/shadcn/ui/dialog';

const props = defineProps<{
    sample: {
        id: string;
        name: string;
        description: string;
        tags: string[];
    };
}>();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

defineEmits<{
    (e: 'expand'): void;
}>();

async function deleteSample() {
    try {
        await sampleRepository.deleteSample({
            bearerToken: authStore.getToken ?? '',
            handleBusinessErrors: true,
            sampleId: props.sample.id,
            orgId: userStore.defaultOrg?.id ?? ''
        });
    } catch (error) {
        if (error instanceof BusinessLogicError) {
            console.log(error);
        }
    }
    router.go(0);
}
</script>

<template>
    <div class="flex flex-col items-end">
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button class="flex gap-2 items-center" variant="ghost">
                        <Icon icon="tabler:dots"></Icon> More
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <DialogTrigger> Edit Profile </DialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="deleteSample()">Delete sample</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropDownEdit :sample="props.sample" />
        </Dialog>
    </div>
</template>
