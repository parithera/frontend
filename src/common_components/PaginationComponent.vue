<template>
    <div class="flex flex-col gap-2 pb-4">
        <div class="w-full">
            <slot name="content"></slot>
        </div>

        <div v-if="totalPages != 1" class="flex flex-row gap-2">
            <Pagination
                v-slot="{ page }"
                :total="nmbEntriesTotal"
                :items-per-page="nmbEntriesShowing"
                :sibling-count="1"
                show-edges
                :default-page="pageModel + 1"
            >
                <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                    <PaginationFirst @click="changePage(0)" />
                    <PaginationPrevious @click="pageModel -= 1" />

                    <template v-for="(item, index) in items">
                        <PaginationItem
                            v-if="item.type === 'page'"
                            :key="index"
                            :value="item.value"
                            as-child
                        >
                            <Button
                                class="w-10 h-10 p-0"
                                :variant="item.value === page ? 'default' : 'outline'"
                                @click="changePage(item.value - 1)"
                            >
                                {{ item.value }}
                            </Button>
                        </PaginationItem>
                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                    </template>

                    <PaginationNext @click="pageModel += 1" />
                    <PaginationLast @click="changePage(totalPages - 1)" />
                </PaginationContent>
            </Pagination>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationNext,
    PaginationPrevious
} from '@/shadcn/ui/pagination';

import { Button } from '@/shadcn/ui/button';

// Models
const pageModel = defineModel<number>('page', { default: 0 });
const nmbEntriesShowing = defineModel<number>('nmbEntriesShowing', { default: 15 });
const nmbEntriesTotal = defineModel<number>('nmbEntriesTotal', { default: 12 });
const totalPages = defineModel<number>('totalPages', { default: 12 });

// Methods
function changePage(_page: number) {
    pageModel.value = Math.min(Math.max(_page, 0), totalPages.value - 1);
}
</script>
