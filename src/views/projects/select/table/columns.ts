import type { Project } from '@/views/projects/project.entity';
import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import DataTableDopDown from './DataTableDopDown.vue';
import { ArrowUpDown } from 'lucide-vue-next';
import Button from '@/shadcn/ui/button/Button.vue';
import { Checkbox } from '@/shadcn/ui/checkbox';
import type { AuthenticatedUser } from '@/views/login/authenticated_user.entity';
import moment from 'moment';
import router from '@/router';

export const columns: ColumnDef<Project>[] = [
    {
        id: 'select',
        header: ({ table }) =>
            h(Checkbox, {
                checked: table.getIsAllPageRowsSelected(),
                'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
                ariaLabel: 'Select all'
            }),
        cell: ({ row }) =>
            h(Checkbox, {
                checked: row.getIsSelected(),
                'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
                ariaLabel: 'Select row'
            }),
        enableSorting: false,
        enableHiding: false
    },
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
        cell: ({ row }) => {
            const name = row.getValue('name') as string;
            return h('div', { class: 'text-left pl-4' }, name);
        }
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
                () => ['Description', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return h('div', { class: 'text-left pl-4' }, description);
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
            // const formatted = new Intl.DateTimeFormat(['en-US', 'fr-FR'], {}).format(date)
            const formatted = moment(date).format('LL');
            return h('div', { class: 'text-left pl-4' }, formatted);
        }
    },
    {
        accessorKey: 'added_by',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Added By', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const user: AuthenticatedUser = row.getValue('added_by');
            const formatted = user.first_name + ' ' + user.last_name;
            return h('div', { class: 'text-left pl-4' }, formatted);
        }
    },
    {
        accessorKey: 'chat',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                },
                () => ['Chat', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            return h(
                'div',
                {
                    class: 'pl-4 text-primary cursor-pointer flex gap-2 items-center',
                    onClick: () => {
                        router.push({
                            name: 'results',
                            params: { page: 'results', projectId: row.original.id }
                        });
                    }
                },
                'Open'
            );
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => {
            const project = row.original;

            return h(
                'div',
                { class: 'relative' },
                h(DataTableDopDown, {
                    project,
                    onExpand: row.toggleExpanded
                })
            );
        }
    }
];
