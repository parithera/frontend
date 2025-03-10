<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

import { cn } from '@/utils/shadcn';

import { Icon } from '@iconify/vue';
import type { Token } from '@/repositories/types/entities/Token';
import { AuthRepository } from '@/repositories/AuthRepository';
import type { AuthenticatedUser } from '@/repositories/types/entities/AuthenticatedUser';
import router from '@/router';
import { BusinessLogicError, ValidationError } from '@/repositories/BaseRepository';

import { Button } from '@/shadcn/ui/button';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { vAutoAnimate } from '@formkit/auto-animate/vue';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';

// Repositories
const authRepository: AuthRepository = new AuthRepository();

// State
const loading: Ref<boolean> = ref(false);
const error: Ref<boolean> = ref(false);
const errorCode: Ref<string | undefined> = ref();
const validationError: Ref<ValidationError | undefined> = ref();

// Form Validation
const formSchema = toTypedSchema(
    z.object({
        email: z.string().email(),
        password: z.string().min(10).max(75)
    })
);
let { handleSubmit } = useForm({
    validationSchema: formSchema
});

const onSubmit = handleSubmit((values) => {
    submit(values);
});

// Stores
const userStore = useUserStore();
const authStore = useAuthStore();

// Sanity checks
// Check if the use is logged in, and if redirect him
if (authStore.getAuthenticated == true) {
    router.push('/');
}

async function submit(values: any) {
    loading.value = true;
    errorCode.value = undefined;
    error.value = false;
    validationError.value = undefined;

    try {
        const token: Token = await authRepository.authenticate({
            data: { email: values.email, password: values.password },
            handleBusinessErrors: true
        });

        const user: AuthenticatedUser = await authRepository.getAuthenticatedUser({
            bearerToken: token.token,
            handleBusinessErrors: true
        });

        authStore.setToken(token.token);
        authStore.setTokenExpiry(token.token_expiry);
        authStore.setRefreshToken(token.refresh_token);
        authStore.setRefreshTokenExpiry(token.refresh_token_expiry);
        authStore.setAuthenticated(true);
        userStore.setUser(user);
        router.push('/');
    } catch (_err) {
        error.value = true;

        if (_err instanceof ValidationError) {
            errorCode.value = _err.error_code;
            validationError.value = _err;
        } else if (_err instanceof BusinessLogicError) {
            if (_err.error_code == 'AccountNotActivated') {
                router.push('/trial');
            }
            errorCode.value = _err.error_code;
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div :class="cn('grid gap-6', $attrs.class ?? '')">
        <form
            class="flex flex-col gap-4"
            :validation-schema="formSchema"
            @submit="onSubmit"
            v-if="!loading"
        >
            <FormField v-slot="{ componentField }" name="email">
                <FormItem v-auto-animate>
                    <FormLabel>Email*:</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="Enter your email" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
                <FormItem v-auto-animate>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button type="submit" class="w-full"> Sign in </Button>
        </form>
        <div class="flex flex-col items-center" v-else>
            Connecting <Icon icon="line-md:loading-twotone-loop" class="animate-spin"></Icon>
        </div>
    </div>
</template>
