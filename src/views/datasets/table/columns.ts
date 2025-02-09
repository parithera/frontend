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
        accessorKey: 'platform',
        
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Platform', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const platform = row.getValue('platform') as string;
            return h('div', { class: 'text-left pl-4' }, platform)
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
        accessorKey: 'reads',
        
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Reads', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const reads = row.getValue('reads') as string;
            return h('div', { class: 'text-left pl-4' }, reads)
        },
    },
    {
        accessorKey: 'study',
        
        header: ({ column }) => "Study",
        cell: ({ row }) => h('a',{class:"text-primary cursor-pointer", href: row.getValue('study') as string}, "NIH"),
    },
    {
        accessorKey: 'explore',
        
        header: ({ column }) => "Explore",
        cell: ({ row }) => h('a',{class:"text-primary cursor-pointer", href: row.getValue('explore') as string}, "NIH"),
    },
]