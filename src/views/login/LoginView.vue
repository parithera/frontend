<script setup lang="ts">
import { cn } from '@/utils/shadcn';
import { buttonVariants } from '@/shadcn/ui/button';
import type { CarouselApi } from '@/shadcn/ui/carousel';

import { useStateStore } from '@/stores/state';
import { ref } from 'vue';
import { watchOnce } from '@vueuse/core';
import Button from '@/shadcn/ui/button/Button.vue';

import ErrorComponent from '@/common_components/ErrorComponent.vue';
import LoadingComponent from '@/common_components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

const UserAuthForm = defineAsyncComponent({
    loader: () => import('@/views/login/sign_in/UserAuthForm.vue'),
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000
});

const state = useStateStore();
state.$reset();

state.page = 'signup';
state.publicPage = true;

const api = ref<CarouselApi>();
const current = ref(0);
const question = ref('');

const words = [
    'find vulnerabilities in my code?',
    'make sure my code is secure?',
    'make sure my code is compliant?'
];
let i = 0,
    offset = 0,
    forwards = true,
    skip_count = 0;
const len = words.length;
const skip_delay = 30;
const speed = 35;
const wordflick = function () {
    setInterval(function () {
        if (forwards) {
            if (offset >= words[i].length) {
                ++skip_count;
                if (skip_count == skip_delay) {
                    forwards = false;
                    skip_count = 0;
                }
            }
        } else {
            if (offset == 0) {
                forwards = true;
                i++;
                offset = 0;
                if (i >= len) {
                    i = 0;
                }
            }
        }
        question.value = words[i].substring(0, offset);
        if (skip_count == 0) {
            if (forwards) {
                offset++;
            } else {
                offset--;
            }
        }
    }, speed);
};
wordflick();

watchOnce(api, (api) => {
    if (!api) return;

    current.value = api.selectedScrollSnap() + 1;

    api.on('select', () => {
        current.value = api.selectedScrollSnap() + 1;
    });
});
</script>

<template>
    <div>
        <RouterLink
            :to="{ name: 'signup' }"
            :class="
                cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute right-4 top-4 md:right-8 md:top-8'
                )
            "
        >
            <img src="@/imgs/logos/logo.svg" class="w-8" />
            Signup
        </RouterLink>
        <div class="h-svh flex justify-center">
            <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <img src="@/imgs/logos/logo.svg" class="w-20 self-center" />
                <div class="flex flex-col space-y-2 text-center">
                    <h1 class="text-2xl font-semibold tracking-tight">Sign In</h1>
                    <p class="text-sm text-muted-foreground">
                        Welcome back. Please enter your credentials.
                    </p>
                </div>
                <UserAuthForm />
                <p class="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our
                    <Button variant="link" class="h-4 p-0">
                        <RouterLink to="/terms">Terms of Service</RouterLink>
                    </Button>
                    and
                    <Button variant="link" class="h-4 p-0">
                        <RouterLink to="/privacy">Privacy Policy</RouterLink>
                    </Button>
                    .
                </p>
            </div>
        </div>
    </div>
</template>
