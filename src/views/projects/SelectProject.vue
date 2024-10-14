<script setup lang="ts">
import type { Project } from '@/repositories/types/entities/Project';
import Button from '@/shadcn/ui/button/Button.vue';
import { type ModelRef } from 'vue';
import CreateProjectForm from './CreateProjectForm.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

defineProps<{
    selected_project: Project;
    newProject: () => Promise<void>;
    isSelectedProject: (project: Project) => 'default' | 'outline';
    selectOrUnselectProject: (project: Project) => Promise<void>;
    deleteProject: (project: Project) => Promise<void>;
}>();

const new_project_name: ModelRef<string> = defineModel('new_project_name', { required: true });
const new_project_description: ModelRef<string> = defineModel('new_project_description', {
    required: true
});
const projects: ModelRef<Array<Project>> = defineModel('projects', { required: true });

// function isOlderThanAWeek(date: Date) {
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     return diff > 7 * 24 * 60 * 60 * 1000;
// }
</script>

<template>
    <div class="w-full flex flex-col gap-6 items-center justify-center mt-20">
        <div class="text-2xl">Please select a project from the list or create a new one</div>
        <div class="w-1/4 flex flex-col items-center gap-2">
            <CreateProjectForm
                v-model:new_project_name="new_project_name"
                v-model:new_project_description="new_project_description"
                :newProject="newProject"
            />
            <!-- <div class="mt-4">This week</div> -->
            <Button
                class="w-full rounded-full"
                v-for="project in projects"
                :key="project.id"
                :variant="isSelectedProject(project)"
                @click="selectOrUnselectProject(project)"
            >
                <div class="flex items-center justify-between w-full gap-2">
                    {{ project.name }}
                    <Icon @click="deleteProject(project)" icon="iconoir:trash"></Icon>
                </div>
            </Button>
            <!-- <div class="mt-4">Older than a week</div>
            <div
                class="flex flex-col gap-2 items-center"
                v-for="project in projects"
                :key="project.id"
            >
                <Button
                    class="w-full rounded-full"
                    v-if="isOlderThanAWeek(new Date(project.imported_on))"
                    :variant="isSelectedProject(project)"
                    @click="selectOrUnselectProject(project)"
                >
                    <div class="flex items-center justify-between w-full gap-2">
                        {{ project.name }}
                        <Icon @click="deleteProject(project)" icon="iconoir:trash"></Icon>
                    </div>
                </Button>
            </div> -->
        </div>
    </div>
</template>
