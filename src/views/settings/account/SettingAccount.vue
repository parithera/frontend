<script lang="ts" setup>
import { useStateStore } from '@/stores/state';

import Dialog from '@/shadcn/ui/dialog/Dialog.vue';
import DialogTrigger from '@/shadcn/ui/dialog/DialogTrigger.vue';
import Button from '@/shadcn/ui/button/Button.vue';
import DialogContent from '@/shadcn/ui/dialog/DialogContent.vue';
import DialogHeader from '@/shadcn/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/shadcn/ui/dialog/DialogTitle.vue';
import DialogDescription from '@/shadcn/ui/dialog/DialogDescription.vue';
import UpdateInfoForm from './forms/UpdateInfoForm.vue';
import UpdatePasswordForm from './forms/UpdatePasswordForm.vue';
import DeleteUserForm from './forms/DeleteUserForm.vue';
import { Alert, AlertDescription } from '@/shadcn/ui/alert';

const state = useStateStore();
state.menu = 'settingsAccount';
</script>
<template>
    <!-- Header -->
    <div class="flex gap-10 items-center">
        <div class="text-2xl flex flex-row gap-2 items-center">
            <span>Settings</span>
            <span>Account</span>
        </div>
        <div class="text-gray-500 font-medium">
            Update your personal information, update your password or delete your account.
        </div>
    </div>

    <div class="grid grid-cols-3 gap-8 mt-10">
        <!-- Personal information -->
        <div class="flex flex-col gap-4">
            <div class="text-2xl text-muted-foreground">Update your personal information</div>
            <UpdateInfoForm></UpdateInfoForm>
        </div>

        <!-- Update Password -->
        <div class="flex flex-col gap-4">
            <div class="text-2xl text-muted-foreground">Update your password</div>
            <UpdatePasswordForm></UpdatePasswordForm>
        </div>

        <!-- Delete Account -->
        <div class="flex flex-col gap-4">
            <div class="text-2xl text-muted-foreground">Delete your account</div>
            <div class="text-lg text-destructive px-4">
                Beware, deleting your account will delete all associated information as well, such
                as uploaded projects, analyses results, organizations and license policies.
            </div>
            <Alert>
                <AlertDescription>
                    <div>
                        Delete your account by clicking the button below. This action is
                        <u>not reversible</u>.
                    </div>
                    <Dialog>
                        <DialogTrigger as-child>
                            <Button variant="destructive"> Delete Profile </Button>
                        </DialogTrigger>
                        <DialogContent class="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Delete profile</DialogTitle>
                                <DialogDescription>
                                    Enter your password to confirm the deletion of your account.
                                </DialogDescription>
                            </DialogHeader>
                            <div class="grid gap-4 py-4">
                                <DeleteUserForm></DeleteUserForm>
                            </div>
                        </DialogContent>
                    </Dialog>
                </AlertDescription>
            </Alert>
        </div>
    </div>
</template>
