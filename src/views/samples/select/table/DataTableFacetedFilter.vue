<script setup lang="ts">
import type { Column } from '@tanstack/vue-table';
import type { Component } from 'vue';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from '@/shadcn/ui/command';

import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { cn } from '@/shadcn/lib/utils';

import { computed } from 'vue';
import { CheckIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import Separator from '@/shadcn/ui/separator/Separator.vue';
import type { Sample } from '@/views/samples/sample.entity';

interface DataTableFacetedFilter {
    column?: Column<Sample, any>;
    title?: string;
    options: FilterOption[];
}

export interface FilterOption {
    label: string;
    value: string;
    icon?: Component;
}

const props = defineProps<DataTableFacetedFilter>();

const facets = computed(() => props.column?.getFacetedUniqueValues());
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]));
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="h-8 border-dashed">
                <Icon icon="tabler:circle-plus" class="mr-2 h-4 w-4"></Icon>
                {{ title }}
                <template v-if="selectedValues.size > 0">
                    <Separator orientation="vertical" class="mx-2 h-4" />
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
                        {{ selectedValues.size }}
                    </Badge>
                    <div class="hidden space-x-1 lg:flex">
                        <Badge
                            v-if="selectedValues.size > 2"
                            variant="secondary"
                            class="rounded-sm px-1 font-normal"
                        >
                            {{ selectedValues.size }} selected
                        </Badge>

                        <template v-else>
                            <Badge
                                v-for="option in options.filter((option) =>
                                    selectedValues.has(option.value)
                                )"
                                :key="option.value"
                                variant="secondary"
                                class="rounded-sm px-1 font-normal"
                            >
                                {{ option.label }}
                            </Badge>
                        </template>
                    </div>
                </template>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0" align="start">
            <Command
                :filter-function="
                    (list: DataTableFacetedFilter['options'], term) =>
                        list.filter((i) => i.label.toLowerCase()?.includes(term))
                "
            >
                <CommandInput :placeholder="title" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        <CommandItem
                            v-for="option in options"
                            :key="option.value"
                            :value="option"
                            @select="
                                (e) => {
                                    console.log(e.detail.value);
                                    const isSelected = selectedValues.has(option.value);
                                    if (isSelected) {
                                        selectedValues.delete(option.value);
                                    } else {
                                        selectedValues.add(option.value);
                                    }
                                    const filterValues = Array.from(selectedValues);
                                    column?.setFilterValue(
                                        filterValues.length ? filterValues : undefined
                                    );
                                }
                            "
                        >
                            <div
                                :class="
                                    cn(
                                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                        selectedValues.has(option.value)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'opacity-50 [&_svg]:invisible'
                                    )
                                "
                            >
                                <CheckIcon :class="cn('h-4 w-4')" />
                            </div>
                            <component
                                :is="option.icon"
                                v-if="option.icon"
                                class="mr-2 h-4 w-4 text-muted-foreground"
                            />
                            <span>{{ option.label }}</span>
                            <span
                                v-if="facets?.get(option.value)"
                                class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
                            >
                                {{ facets.get(option.value) }}
                            </span>
                        </CommandItem>
                    </CommandGroup>

                    <template v-if="selectedValues.size > 0">
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem
                                :value="{ label: 'Clear filters' }"
                                class="justify-center text-center"
                                @select="column?.setFilterValue(undefined)"
                            >
                                Clear filters
                            </CommandItem>
                        </CommandGroup>
                    </template>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
