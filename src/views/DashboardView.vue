<script lang="ts" setup>
import Alert from '@/shadcn/ui/alert/Alert.vue';
import AlertDescription from '@/shadcn/ui/alert/AlertDescription.vue';
import AlertTitle from '@/shadcn/ui/alert/AlertTitle.vue';
import { useStateStore } from '@/stores/state';
import { Terminal } from 'lucide-vue-next';

const state = useStateStore();
state.$reset();

state.page = 'dashboard';
</script>

<template>
    <div class="h-[calc(100vh-4rem)] w-screen flex items-center justify-center">
        <div>
            <Alert>
                <Terminal class="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    <span>
                        The dashboard is coming soon! You can use the project page for now.
                    </span>
                </AlertDescription>
            </Alert>
        </div>
    </div>
</template>
