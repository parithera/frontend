import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { ArrowUpDown } from 'lucide-vue-next'
import Button from '@/shadcn/ui/button/Button.vue';
import type { Sample } from '@/views/samples/sample.entity';

export const columns: ColumnDef<Sample>[] = [
    {
        accessorKey: 'name',

        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const name = row.getValue('name') as string;
            return h('div', { class: 'text-left pl-4' }, name)
        },
    },
    {
        accessorKey: 'organism',

        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Organism', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const name = row.getValue('organism') as string;
            return h('div', { class: 'text-left pl-4' }, name)
        },
    },
    {
        accessorKey: 'assay',

        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Assay', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const name = row.getValue('assay') as string;
            return h('div', { class: 'text-left pl-4' }, name)
        },
    },
    {
        accessorKey: 'cells',

        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Cells', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const cells = row.getValue('cells') as number;
            const formattedCells = new Intl.NumberFormat().format(cells);
            return h('div', { class: 'text-left pl-4' }, formattedCells)
        },
    },
    {
        accessorKey: 'import',

        header: ({ column }) => "",
        cell: ({ row }) => h("span", { class: 'cursor-pointer text-primary' }, "Import"),
    },
    {
        accessorKey: 'show',

        header: ({ column }) => "",
        cell: ({ row }) => h('a', { class: "text-primary cursor-pointer", href: row.getValue('show') as string }, "Explore"),
    },
]