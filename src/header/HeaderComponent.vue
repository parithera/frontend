<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MainNav from './components/MainNav.vue';
import SearchHeader from './components/SearchHeader.vue';
import UserNav from './components/UserNav.vue';
import TeamSwitcher from './components/TeamSwitcher.vue';
</script>

<template>
    <div class="border-b h-12">
        <div class="flex h-full items-center px-4 gap-4">
            <RouterLink :to="{ name: 'home' }" class="flex gap-1 items-center">
                <img src="@/imgs/logos/logo_name.svg" class="h-5 self-center" />
            </RouterLink>

            <TeamSwitcher />
            <MainNav class="mx-6" />
            <div class="ml-auto flex items-center space-x-4">
                <SearchHeader />
                <UserNav />
            </div>
        </div>
    </div>
</template>
