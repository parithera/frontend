import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { ArrowUpDown } from 'lucide-vue-next';
import Button from '@/shadcn/ui/button/Button.vue';
import { Checkbox } from '@/shadcn/ui/checkbox';
import moment from 'moment';
import type { Sample } from '@/views/samples/sample.entity';

export const columns: ColumnDef<Sample>[] = [
    {
        id: 'select',
        header: ({ table }) =>
            h(Checkbox, {
                checked: table.getIsAllPageRowsSelected(),
                'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
                ariaLabel: 'Select all'
            }),
        cell: ({ row }) =>
            h(Checkbox, {
                checked: row.getIsSelected(),
                'onUpdate:modelValue': (value: boolean) => {
                    console.log(row);
                    return row.toggleSelected(!!value);
                },
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
            return h('div', { class: 'text-right font-medium' }, name);
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
                () => ['Comment', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
            );
        },
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return h('div', { class: 'text-right font-medium' }, description);
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
            return h('div', { class: 'text-right font-medium' }, formatted);
        }
    }
];
