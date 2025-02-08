import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { ArrowUpDown } from 'lucide-vue-next'
import Button from '@/shadcn/ui/button/Button.vue';
import { Checkbox } from '@/shadcn/ui/checkbox'
import type { Dataset } from '../SelectDataset.vue';



export const columns: ColumnDef<Dataset>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected(),
            'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
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
        accessorKey: 'tissue',
        
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Tissue', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const tissue = row.getValue('tissue') as string;
            return h('div', { class: 'text-left pl-4' }, tissue)
        },
    },
    {
        accessorKey: 'disease',
        
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Disease', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const disease = row.getValue('disease') as string;
            return h('div', { class: 'text-left pl-4' }, disease)
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
            const assay = row.getValue('assay') as string;
            return h('div', { class: 'text-left pl-4' }, assay)
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
            const organism = row.getValue('organism') as string;
            return h('div', { class: 'text-left pl-4' }, organism)
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
            const cells = row.getValue('cells') as string;
            return h('div', { class: 'text-left pl-4' }, cells)
        },
    },
    {
        accessorKey: 'publication',
        
        header: ({ column }) => "Publication",
        cell: ({ row }) => "BioRxiv",
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => {
            const project = row.original

            return h('a', { href:"google.fr",class: 'relative' }, "Explore")
        },
    },
]