import type { ColumnDef } from '@tanstack/vue-table';
import { h, type VNode } from 'vue';
import DataTableDropDown from './DataTableDropDown.vue';
import { ArrowUpDown } from 'lucide-vue-next';
import Button from '@/shadcn/ui/button/Button.vue';
import moment from 'moment';
import type { Sample } from '@/views/samples/sample.entity';
import { RouterLink } from 'vue-router';
import Badge from '@/shadcn/ui/badge/Badge.vue';

export const columns: ColumnDef<Sample>[] = [
    // {
    //     id: 'select',
    //     header: ({ table }) =>
    //         h(Checkbox, {
    //             checked: table.getIsAllPageRowsSelected(),
    //             'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
    //             ariaLabel: 'Select all'
    //         }),
    //     cell: ({ row }) =>
    //         h(Checkbox, {
    //             checked: row.getIsSelected(),
    //             'onUpdate:modelValue': (value: boolean) => row.toggleSelected(!!value),
    //             ariaLabel: 'Select row'
    //         }),
    //     enableSorting: false,
    //     enableHiding: false
    // },
    {
        accessorKey: 'name',

        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => h('div', { class: 'text-left pl-4' }, row.getValue('name') as string)
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Comment', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) =>
            h('div', { class: 'text-left pl-4' }, row.getValue('description') as string)
    },
    {
        accessorKey: 'tags',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Tags', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const tags: string[] = row.getValue('tags');
            const badges: VNode[] = [];

            for (const tag of tags) {
                badges.push(h(Badge, { variant: 'secondary' }, tag));
            }

            return h('div', { class: 'text-left pl-4 flex gap-2 flex-wrap' }, badges);
        },
        filterFn: (row, columnId, filterValue) => {
            for (const filter of filterValue) {
                if ((row.getValue(columnId) as Array<string>).includes(filter)) return true;
            }
            return false;
        }
    },
    {
        accessorKey: 'added_on',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Creation Date', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('added_on'));
            return h('div', { class: 'text-left pl-4' }, moment(date).format('LL'));
        }
    },

    {
        accessorKey: 'type',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Type', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-left pl-4' }, row.getValue('type'));
        }
    },
    {
        accessorKey: 'qc',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Quality Control', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            if (row.original.show == '') {
                return h(
                    RouterLink,
                    {
                        class: 'pl-4 text-primary',
                        to: {
                            name: 'samples',
                            params: { page: 'qc' },
                            query: {
                                sampleId: row.original.id
                            }
                        }
                    },
                    'Show QC'
                );
            }
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => {
            const sample = row.original;

            return h(
                'div',
                { class: 'relative' },
                h(DataTableDropDown, {
                    sample,
                    onExpand: row.toggleExpanded
                })
            );
        }
    }
];
