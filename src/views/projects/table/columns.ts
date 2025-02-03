import type { Project } from '@/repositories/types/entities/Project'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import DataTableDopDown from './DataTableDopDown.vue';
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import Button from '@/shadcn/ui/button/Button.vue';
import { Checkbox } from '@/shadcn/ui/checkbox'



export const columns: ColumnDef<Project>[] = [
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
        header: () => h('div', { class: 'text-right' }, 'Name'),
        cell: ({ row }) => {
            const name = row.getValue('name') as string;
            return h('div', { class: 'text-right font-medium' }, name)
        },
    },
    {
        accessorKey: 'description',
        header: () => h('div', { class: 'text-right' }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return h('div', { class: 'text-right font-medium' }, description,)
        },
    }, 
    {
        accessorKey: 'added_on',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Creation Date', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('added_on'))
            const formatted = new Intl.DateTimeFormat(['en-US', 'fr-FR'], {}).format(date)
            h('div', { class: 'text-right font-medium' }, formatted)
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => {
            const project = row.original

            return h('div', { class: 'relative' }, h(DataTableDopDown, {
                project,
                onExpand: row.toggleExpanded,
            }))
        },
    },
]