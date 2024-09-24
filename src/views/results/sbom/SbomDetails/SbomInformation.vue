<template>
    <div>
        <h2 class="font-black"><span class="text-primary text-3xl">I</span>nformation</h2>
        <div class="flex flex-col gap-2 pl-5 pt-5">
            <div
                v-if="dependency.is_package_managed && dependency.file_path.includes('NPM')"
                class="flex gap-2 items-center"
            >
                Integrated through:
                <a
                    :href="`https://www.npmjs.com/package/${dependency.name}/v/${dependency.version}`"
                    target="_blank"
                    class="flex gap-1 items-center"
                >
                    <Icon
                        :icon="'akar-icons:npm-fill'"
                        title="Dependency is integrated via npm."
                    ></Icon>
                    NPM
                </a>
            </div>
            <div
                v-else-if="dependency.is_package_managed && dependency.file_path.includes('YARN')"
                class="flex gap-2 items-center"
            >
                Integrated through:
                <a
                    :href="`https://yarnpkg.com/package?name=${dependency.name}&version=${dependency.version}`"
                    target="_blank"
                    class="flex gap-1 items-center"
                >
                    <Icon
                        :icon="'akar-icons:yarn-fill'"
                        title="Dependency is integrated via yarn."
                    ></Icon>
                    Yarn
                </a>
            </div>
            <div v-else-if="dependency.is_self_managed == true" class="flex gap-2 items-center">
                Integrated through:
                <Icon :icon="'ion:document-outline'"></Icon>
                <span>
                    <span class="font-black">
                        {{ dependency.name }}
                    </span>
                    self-managed
                </span>
            </div>
            <div>Version: {{ dependency.version }}</div>
            <div
                v-if="moment(dependency.release).toString() !== 'Mon Jan 01 0001 00:17:30 GMT+0017'"
            >
                Release date: {{ moment(dependency.release) }}
            </div>
            <div v-if="dependency.engines">
                Engines supported:
                <ul class="list-disc pl-8">
                    <li v-for="(value, key) in dependency.engines as Object" :key="key">
                        <div class="flex items-center gap-2">
                            <Icon
                                class="min-w-4"
                                v-if="dependency.engines.hasOwnProperty('node')"
                                :icon="'akar-icons:node-fill'"
                            ></Icon
                            >{{ value }}
                        </div>
                    </li>
                </ul>
            </div>
            <BubbleComponent :slim="true">
                <template #content>
                    {{ dependency.file_path }}
                </template>
            </BubbleComponent>

            <div class="flex gap-2">
                <BubbleComponent v-if="dependency.vulnerable == true" :bad="true" :slim="true">
                    <template #content> Vulnerable </template>
                </BubbleComponent>

                <BubbleComponent v-if="dependency.deprecated == true" :bad="true" :slim="true">
                    <template #content> Deprecated </template>
                </BubbleComponent>

                <BubbleComponent v-if="dependency.unlicensed == true" :blue="true" :slim="true">
                    <template #content> Unlicensed </template>
                </BubbleComponent>

                <BubbleComponent
                    v-if="dependency.outdated == true"
                    :partiallyPatchable="true"
                    :slim="true"
                >
                    <template #content> Outdated </template>
                </BubbleComponent>
            </div>

            <div class="flex items-center gap-1" v-if="dependency.licenses.length > 0">
                <div>Licenses:</div>
                <div v-for="license in dependency.licenses" :key="license">
                    <BubbleComponent :slim="true">
                        <template #content>
                            {{ license }}
                        </template>
                    </BubbleComponent>
                </div>
            </div>
            <div class="flex items-center gap-1" v-if="dependency.non_spdx_licenses.length > 0">
                <div>Non SPDX Licenses:</div>
                <div v-for="license in dependency.non_spdx_licenses" :key="license">
                    <BubbleComponent :slim="true">
                        <template #content>
                            {{ license }}
                        </template>
                    </BubbleComponent>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BubbleComponent from '@/common_components/bubbles/BubbleComponent.vue';
import { DependencyDetails } from '@/repositories/types/entities/SbomDetails';
import { Icon } from '@iconify/vue/dist/iconify.js';
import moment from 'moment';
import type { PropType } from 'vue';

defineProps({
    dependency: {
        type: Object as PropType<DependencyDetails>,
        required: true
    }
});
</script>
