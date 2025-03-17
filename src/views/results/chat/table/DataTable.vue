<script setup lang="ts" generic="TData, TValue">
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ExpandedState,
    Row
} from '@tanstack/vue-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';

import {
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useVueTable
} from '@tanstack/vue-table';
import { valueUpdater } from '@/utils/shadcn';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/shadcn/ui/dropdown-menu';
import { Input } from '@/shadcn/ui/input';
import { Button } from '@/shadcn/ui/button';
import { ref, watch, type ModelRef, type Ref } from 'vue';
import type { Sample } from '@/views/samples/sample.entity';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { ChevronDown } from 'lucide-vue-next';
import { useLinkSamplesStore } from '@/sockets/link_samples';
import { storeToRefs } from 'pinia';
import type { Group } from '../types';
import Progress from '@/shadcn/ui/progress/Progress.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    project_id: string;
}>();

const table = useVueTable({
    get data() {
        return props.data;
    },
    get columns() {
        return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
    state: {
        get sorting() {
            return sorting.value;
        },
        get columnFilters() {
            return columnFilters.value;
        },
        get columnVisibility() {
            return columnVisibility.value;
        },
        get rowSelection() {
            return rowSelection.value;
        },
        get expanded() {
            return expanded.value;
        }
    }
});

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Models
const samples: ModelRef<Array<Sample>> = defineModel('samples', { required: true });

// Refs
const selected_samples: Ref<Array<Sample>> = ref([]);
const loading: Ref<boolean> = ref(false);
const progress: Ref<number> = ref(0);

const linkSamplesStore = useLinkSamplesStore();
const { response } = storeToRefs(linkSamplesStore);

async function importSamplesToProject(selected_rows: Row<TData>[]) {
    loading.value = true;
    linkSamplesStore.$reset();
    linkSamplesStore.createSocket(authStore.getToken ?? '');
    // remove any existing listeners (after a hot module replacement)
    linkSamplesStore.getSocket.off();
    linkSamplesStore.bindEvents();
    linkSamplesStore.connect();

    const groups: Array<Group> = [];
    for (const row of selected_rows) {
        const sample = row.original as Sample;
        selected_samples.value.push(sample);
        groups.push({
            name: sample.name,
            files: [sample.id]
        });
    }

    linkSamplesStore.askChat({
        groups: groups,
        projectId: props.project_id,
        userId: userStore.user?.id ?? '',
        organizationId: userStore.getDefaultOrg?.id ?? ''
    });
}

watch(response, () => {
    if (response.value?.data.status == 'done') {
        samples.value = selected_samples.value;
    }
});

watch(loading, () => {
    if (loading.value) {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            progress.value = Math.min(currentProgress, 100);
            if (progress.value >= 100) {
                clearInterval(interval);
            }
        }, 6000); // Increment progress every 600ms to reach 100 in about 1 minute
    } else {
        progress.value = 0; // Reset progress when loading is false
    }
});
</script>

<template>
    <div v-if="loading" class="flex flex-col items-center space-y-3">
        <div class="text-2xl flex gap-2 items-center">
            <Icon class="animate-spin" icon="tabler:loader-2"></Icon>
            <span>Linking samples to project</span>
        </div>
        <div>Please wait</div>
        <Progress v-model="progress"></Progress>
    </div>
    <div v-else class="flex flex-col gap-4">
        <div class="text-2xl">Select samples to use in this project</div>
        <div class="flex items-center gap-2">
            <Input
                class="max-w-sm"
                placeholder="Filter names..."
                :model-value="table.getColumn('name')?.getFilterValue() as string"
                @update:model-value="table.getColumn('name')?.setFilterValue($event)"
            />
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" class="ml-auto">
                        Columns
                        <ChevronDown class="w-4 h-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                        v-for="column in table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())"
                        :key="column.id"
                        class="capitalize"
                        :checked="column.getIsVisible()"
                        @update:checked="
                            (value) => {
                                column.toggleVisibility(!!value);
                            }
                        "
                    >
                        {{ column.id }}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div class="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <template v-for="row in table.getRowModel().rows" :key="row.id">
                            <TableRow :data-state="row.getIsSelected() ? 'selected' : undefined">
                                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                    <FlexRender
                                        :render="cell.column.columnDef.cell"
                                        :props="cell.getContext()"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="row.getIsExpanded()">
                                <TableCell :colspan="row.getAllCells().length">
                                    Name: {{ row.getValue('name') }} Added by:
                                    {{ row.getValue('added_on') }}
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="columns.length" class="h-24 text-center">
                                No projects.
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
        <Button @click="importSamplesToProject(table.getSelectedRowModel().flatRows)"
            >Import</Button
        >
    </div>
</template>
