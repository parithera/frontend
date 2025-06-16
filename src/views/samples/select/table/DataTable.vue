<script setup lang="ts" generic="TData, TValue">
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ExpandedState
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
import { valueUpdater } from '@/shadcn/lib/utils';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/shadcn/ui/dropdown-menu';
import { Input } from '@/shadcn/ui/input';
import { Button } from '@/shadcn/ui/button';
import { computed, ref } from 'vue';
import CreateSampleForm from '@/views/samples/create/CreateSampleForm.vue';
import DataTableFacetedFilter, { type FilterOption } from './DataTableFacetedFilter.vue';
import { ChevronDown } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { Dialog, DialogTrigger } from '@/shadcn/ui/dialog';
import DropDownEdit from './DropDownEdit.vue';

const props = defineProps<{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tags: Array<FilterOption>;
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
    filterFns: {}, // Don't remove, this is needed to filter tags
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
const columnVisibility = ref<VisibilityState>({
    qc: false,
    type: false
});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const isFiltered = computed(() => table.getState().columnFilters.length > 0);
</script>

<template>
    <div>
        <CreateSampleForm></CreateSampleForm>
        <div class="flex items-center py-4 gap-2">
            <Input
                class="max-w-sm"
                placeholder="Filter names..."
                :model-value="table.getColumn('name')?.getFilterValue() as string"
                @update:model-value="table.getColumn('name')?.setFilterValue($event)"
            />
            <DataTableFacetedFilter
                v-if="table.getColumn('tags')"
                :column="table.getColumn('tags')"
                title="Tags"
                :options="props.tags"
            />
            <Button
                v-if="isFiltered"
                variant="ghost"
                class="h-8 px-2 lg:px-3"
                @click="table.resetColumnFilters()"
            >
                Reset
                <Icon icon="ic:baseline-close"></Icon>
            </Button>
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
                        :model-value="column.getIsVisible()"
                        @update:model-value="
                            (value) => {
                                column.toggleVisibility(!!value);
                            }
                        "
                    >
                        <span v-if="column.id == 'description'">Comment</span>
                        <span v-else>{{ column.id }}</span>
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
                            <Dialog>
                                <TableRow
                                    :data-state="row.getIsSelected() ? 'selected' : undefined"
                                >
                                    <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                        <FlexRender
                                            v-if="cell.column.id == 'actions'"
                                            :render="cell.column.columnDef.cell"
                                            :props="cell.getContext()"
                                        />
                                        <DialogTrigger v-else class="cursor-pointer" as-child>
                                            <FlexRender
                                                v-if="
                                                    cell.column.id != 'qc' ||
                                                    (cell.column.id == 'qc' &&
                                                        row.getValue('type') == 'fastq')
                                                "
                                                :render="cell.column.columnDef.cell"
                                                :props="cell.getContext()"
                                            />
                                        </DialogTrigger>
                                    </TableCell>
                                </TableRow>
                                <DropDownEdit :sample="row.original" />
                            </Dialog>
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
        <CreateSampleForm></CreateSampleForm>
        <div class="flex items-center justify-end py-4 space-x-2">
            <div class="flex-1 text-sm text-muted-foreground">
                {{ table.getFilteredSelectedRowModel().rows.length }} of
                {{ table.getFilteredRowModel().rows.length }} row(s) selected.
            </div>
            <div class="flex gap-2">
                <Button v-if="table.getCanPreviousPage()" size="sm" @click="table.previousPage()">
                    Previous
                </Button>
                <Button v-if="table.getCanNextPage()" size="sm" @click="table.nextPage()">
                    Next
                </Button>
            </div>
        </div>
    </div>
</template>
