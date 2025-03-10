<script setup lang="ts">
import { BusinessLogicError } from '@/repositories/BaseRepository';
import { SampleRepository } from '@/repositories/SampleRepository';
import router from '@/router';
import { Button } from '@/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{
    sample: {
        id: string
    }
}>()

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Repositories
const sampleRepository: SampleRepository = new SampleRepository();

defineEmits<{
    (e: 'expand'): void
}>()

async function deleteSample(project_id: string) {
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
    router.go(0)
}
</script>

<template>
    <div class="flex flex-col items-end">
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button class="flex gap-2 items-center" variant="ghost">
                    <Icon icon="tabler:dots"></Icon> More
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="deleteSample(sample.id)">Delete sample</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>