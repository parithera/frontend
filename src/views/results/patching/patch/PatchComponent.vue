<template>
    <BorderCard>
        <template v-if="patch" #content>
            <div class="flex flex-col gap-4">
                <div class="flex flex-rom items-center gap-8 font-bold">
                    <div class="text-2xl">
                        {{ patch.vulnerability_id }}
                    </div>
                    <div>
                        <span
                            v-if="patch.patch_type == 'FULL'"
                            class="flex gap-1 items-center text-severityLow"
                        >
                            <Icon icon="bi:shield-fill-check" />
                            Full patch available
                        </span>
                        <span
                            v-else-if="patch.patch_type == 'PARTIAL'"
                            class="flex gap-1 items-center text-severityMedium"
                        >
                            <Icon icon="bi:shield-fill-minus" />
                            Partial patch available
                        </span>
                        <span
                            v-else-if="patch.patch_type == 'NONE'"
                            class="flex gap-1 items-center text-severityHigh"
                        >
                            <Icon icon="bi:shield-fill-exclamation" />
                            No patch available
                        </span>
                    </div>
                </div>
                <div
                    v-if="
                        patch.vulnerability_info.Weaknesses &&
                        patch.vulnerability_info.Weaknesses.length > 0
                    "
                    class="text-lg"
                >
                    {{ patch.vulnerability_info.Weaknesses[0] }} in
                    <span class="font-semibold">{{ patch.affected_dep_name }}</span>
                </div>
                <div v-if="patch.introduction_type == 'NEWLY_INTRODUCED'">
                    <Alert variant="destructive">
                        <AlertCircle class="w-4 h-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This vulnerability is <b>introduced</b> if you apply our suggested
                            patches! Certain dependencies are upgraded - to fix the existing
                            vulnerabilities - but as a result, introduce some other unpatchable
                            vulnerability.
                        </AlertDescription>
                    </Alert>
                </div>

                <div class="font-normal">
                    <div class="flex flex-row gap-4 items-center">
                        Total occurences:
                        <Badge>{{ patch.occurance_count }}</Badge>
                    </div>
                    <div
                        v-if="patch.patchable_occurances_count > 0"
                        class="flex flex-row gap-4 items-center"
                    >
                        Patchable occurences:
                        <Badge class="flex gap-2"
                            >{{ patch.patchable_occurances_count }}
                            <Icon icon="bi:shield-fill-check"
                        /></Badge>
                    </div>
                    <div
                        v-if="patch.unpatchable_occurances_count > 0"
                        class="flex flex-row gap-4 items-center"
                    >
                        Unpatchable occurences:
                        <Badge class="flex gap-2"
                            >{{ patch.unpatchable_occurances_count }}
                            <Icon icon="bi:shield-fill-exclamation"
                        /></Badge>
                    </div>
                </div>

                <div
                    class="flex flex-row gap-2 items-center w-full text-center font-medium color-gray-600"
                >
                    <div
                        class="click-scale flex flex-row gap-2 items-center justify-center rounded py-2 cursor-pointer bg-muted w-1/2"
                        @click="active_view = 'patches'"
                    >
                        <Icon icon="bi:list" /> Patches
                    </div>
                    <div
                        class="click-scale flex flex-row gap-2 items-center justify-center rounded py-2 cursor-pointer bg-muted w-1/2"
                        @click="active_view = 'tree'"
                    >
                        <Icon icon="ri:node-tree" /> Tree
                    </div>
                </div>

                <template v-if="active_view == 'patches'">
                    <!--------------------------------------------------------------------------->
                    <!--                            Top level patches                          -->
                    <!--------------------------------------------------------------------------->
                    <div
                        v-for="(top_patch, direct_dep) in patch.patches"
                        :key="direct_dep"
                        class="patch"
                    >
                        <!--------------------------------------------------------------------------->
                        <!--                               Full patch                              -->
                        <!--------------------------------------------------------------------------->
                        <BorderCard v-if="top_patch.patch_type == 'FULL'">
                            <template #content>
                                <div class="findings-patch-container-header">
                                    <div class="flex flex-row gap-2 items-center font-black">
                                        <span class="highlight bold">{{
                                            top_patch.direct_dep_name
                                        }}</span>
                                        <span class="flex gap-1 items-center text-severityLow">
                                            <Icon icon="bi:shield-fill-check" /> Full
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        Upgrading direct dependency
                                        <span class="highlight">{{
                                            top_patch.direct_dep_name
                                        }}</span>
                                        to version:
                                        <span class="highlight">{{
                                            top_patch.direct_dep_upgrade_version
                                        }}</span>
                                        will upgrade
                                        <span class="highlight">{{ patch.affected_dep_name }}</span>
                                        to a patched version.
                                    </div>
                                </div>
                                <div class="collapsible-content"></div>
                            </template>
                        </BorderCard>

                        <!--------------------------------------------------------------------------->
                        <!--                             Partial patch                             -->
                        <!--------------------------------------------------------------------------->
                        <BorderCard v-if="top_patch.patch_type == 'PARTIAL'">
                            <template #content>
                                <div class="findings-patch-container-header">
                                    <div class="flex flex-row gap-2 items-center font-black">
                                        <span class="highlight bold">{{
                                            top_patch.direct_dep_name
                                        }}</span>
                                        <span class="flex gap-1 items-center text-severityMedium">
                                            <Icon icon="bi:shield-fill-minus" /> Partial
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        Upgrading direct dependency
                                        <span class="highlight">{{
                                            top_patch.direct_dep_name
                                        }}</span>
                                        to version:
                                        <span class="highlight">{{
                                            top_patch.direct_dep_upgrade_version
                                        }}</span>
                                        will upgrade some occurences of
                                        <span class="highlight">{{ patch.affected_dep_name }}</span>
                                        to a patched version, but will leave some instances
                                        unpatched.
                                        <a href="">More info</a>
                                    </div>
                                </div>
                                <div class="collapsible-content"></div>
                            </template>
                        </BorderCard>

                        <!--------------------------------------------------------------------------->
                        <!--                               Unpatchable                             -->
                        <!--------------------------------------------------------------------------->
                        <BorderCard v-if="top_patch.patch_type == 'NONE'">
                            <template #content>
                                <div class="findings-patch-container-header">
                                    <div class="flex flex-row gap-2 items-center font-black">
                                        <span class="highlight bold">{{
                                            top_patch.direct_dep_name
                                        }}</span>
                                        <span class="flex gap-1 items-center text-severityHigh">
                                            <Icon icon="bi:shield-fill-exclamation" /> None
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        The direct dependency
                                        <span class="highlight">{{
                                            top_patch.direct_dep_name
                                        }}</span>
                                        cannot be upgraded such that
                                        <span class="highlight">{{ patch.affected_dep_name }}</span>
                                        is upgraded to a patched version.
                                    </div>
                                </div>
                                <div class="collapsible-content"></div>
                            </template>
                        </BorderCard>
                    </div>
                </template>

                <template v-if="active_view == 'tree'">
                    <Tree :nodes="node_array" :show-vuln-i-ds="true" />
                </template>
            </div>
        </template>
    </BorderCard>
</template>
<script lang="ts" setup>
import { ref, watch, type Ref } from 'vue';
import Tree from '../location_subtree/PatchingTree.vue';
import { TreeGenerator } from '@/utils/tree/patching/TreeGenerator';
import type { TreeNode } from '@/utils/tree/patching/TreeNode';
import type { PatchOccurenceInfo } from '@/utils/tree/patching/TreeGenerator';
import { Icon } from '@iconify/vue';
import type { PatchInfo } from '@/repositories/types/entities/Patching';
import BorderCard from '@/common_components/cards/BorderCard.vue';
import Badge from '@/shadcn/ui/badge/Badge.vue';
import Alert from '@/shadcn/ui/alert/Alert.vue';
import { AlertCircle } from 'lucide-vue-next';
import AlertTitle from '@/shadcn/ui/alert/AlertTitle.vue';
import AlertDescription from '@/shadcn/ui/alert/AlertDescription.vue';

export interface Props {
    patch: PatchInfo;
}

const props = withDefaults(defineProps<Props>(), {});

const node_array: Ref<TreeNode[]> = ref(new Array<TreeNode>());
const active_view = ref('patches');

function computeTree() {
    if (props.patch && props.patch.patches) {
        let paths = [];
        let patched_paths = [];
        let unpatched_paths = [];
        let introduced_paths = [];
        for (let [, directDepPatchInfo] of Object.entries(props.patch.patches)) {
            if ('patched_occurences' in directDepPatchInfo) {
                paths.push(...directDepPatchInfo['patched_occurences'].Paths);
                patched_paths.push(...directDepPatchInfo['patched_occurences'].Paths);
            }
            if ('unpatched_occurences' in directDepPatchInfo) {
                paths.push(...directDepPatchInfo['unpatched_occurences'].Paths);
                unpatched_paths.push(...directDepPatchInfo['unpatched_occurences'].Paths);
            }
            if ('introduced_occurences' in directDepPatchInfo) {
                paths.push(...directDepPatchInfo['introduced_occurences'].Paths);
                introduced_paths.push(...directDepPatchInfo['introduced_occurences'].Paths);
            }
        }
        let data: PatchOccurenceInfo[] = [
            {
                vulnerability_id: props.patch.vulnerability_id,
                affected_deps: props.patch.affected_deps,
                all_occurences: paths,
                patched_occurences: patched_paths,
                unpatched_occurences: unpatched_paths,
                introduced_occurences: introduced_paths
            }
        ];
        node_array.value = new TreeGenerator().generateTree(data);
    }
}
computeTree();

watch(
    () => props.patch,
    () => {
        computeTree();
    }
);
</script>
