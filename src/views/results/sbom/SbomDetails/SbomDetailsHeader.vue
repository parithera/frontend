<template>
    <div class="flex flex-col gap-2">
        <TitleAndSubtitle>
            <template #title>{{ dependency.name }}</template>
            <template #subtitle>{{ dependency.version }}</template>
        </TitleAndSubtitle>

        <div class="text-gray-600">
            <div v-if="dependency.parents.length == 0">
                This is a direct dependency of the project.
            </div>
            <!-- <div v-else>
                Imported by: {{ dependency.parents.join(', ') }}
            </div> -->
        </div>
        <div v-if="!dependency.is_self_managed" class="flex gap-6">
            <BubbleComponent>
                <template #content>
                    <a
                        :href="`https://www.npmjs.com/package/${dependency.name}/v/${dependency.version}`"
                        target="_blank"
                        class="flex flex-wrap gap-1 items-center"
                        title="opens the npm package page (in a new tab)"
                    >
                        <Icon :icon="'akar-icons:npm-fill'"></Icon> NPM
                    </a>
                </template>
            </BubbleComponent>
            <BubbleComponent>
                <template #content>
                    <a
                        :href="`https://yarnpkg.com/package?name=${dependency.name}&version=${dependency.version}`"
                        target="_blank"
                        class="flex flex-wrap gap-1 items-center"
                        title="opens the yarn package page (in a new tab)"
                    >
                        <Icon :icon="'akar-icons:yarn-fill'"></Icon> Yarn
                    </a>
                </template>
            </BubbleComponent>
            <BubbleComponent v-if="dependency.git_url">
                <template #content>
                    <a
                        :href="`https://${dependency.git_url.repo_full_path}`"
                        target="_blank"
                        title="opens the github repo of the dependency (in a new tab)"
                    >
                        <div
                            v-if="dependency.git_url.host_type == 'GITHUB'"
                            class="flex flex-wrap gap-1 items-center"
                        >
                            <Icon :icon="'akar-icons:github-fill'"></Icon> Github
                        </div>
                        <div
                            v-else-if="dependency.git_url.host_type == 'GITLAB'"
                            class="flex flex-wrap gap-1 items-center"
                        >
                            <Icon :icon="'akar-icons:gitlab-fill'"></Icon> Gitlab
                        </div>
                    </a>
                </template>
            </BubbleComponent>
            <!-- <div v-if="dependency.website">
            <a :href="dependency.website" title="opens the website of the dependency (in a new tab)" target="_blank"
                style="text-decoration: none; color: inherit"><i class="fa-solid fa-link"></i> Website</a>
        </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import BubbleComponent from '@/common_components/bubbles/BubbleComponent.vue';
import TitleAndSubtitle from '@/common_components/headers/TitleAndSubtitle.vue';
import { DependencyDetails } from '@/repositories/types/entities/SbomDetails';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { PropType } from 'vue';

defineProps({
    dependency: {
        type: Object as PropType<DependencyDetails>,
        required: true
    }
});
</script>
