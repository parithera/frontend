import { Entity } from './types/entities/Entity';
import { CreatedResponse } from '@/repositories/types/responses/CreatedResponse';
import {
    BaseRepository,
    type AuthRepoMethodGetRequestOptions,
    type AuthRepoMethodPostRequestOptions,
    type PaginatedRepoMethodRequestOptions,
    type SearchableRepoMethodRequestOptions,
    type SortableRepoMethodRequestOptions,
} from './BaseRepository';
import type { CreateSample } from './types/postBodies/CreateSample';
import { PaginatedResponse } from './types/responses/PaginatedResponse';
import type { Sample } from './types/entities/Sample';
import type { UploadData, UploadRequestOptions } from './FileRepository';
import { NoDataResponse } from './types/responses/NoDataResponse';

export interface GetSamplesRequestOptions
    extends AuthRepoMethodGetRequestOptions,
    PaginatedRepoMethodRequestOptions,
    SearchableRepoMethodRequestOptions,
    SortableRepoMethodRequestOptions {
    orgId: string;
}


export interface CreateSampleOptions extends AuthRepoMethodPostRequestOptions<CreateSample> {
    orgId: string;
}

export class SampleRepository extends BaseRepository {
    async getSamples(options: GetSamplesRequestOptions): Promise<PaginatedResponse<Sample>> {
        const RELATIVE_URL = `/org/${options.orgId}/samples`;

        const response = await this.getRequest<PaginatedResponse<Sample>>({
            queryParams: {
                page: options.pagination.page,
                entries_per_page: options.pagination.entries_per_page,
                search_key: options.search.searchKey,
                sort_key: options.sort.sortKey,
                sort_direction: options.sort.sortDirection
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<PaginatedResponse<Sample>>(response, PaginatedResponse<Sample>);
    }

    async createSample(options: CreateSampleOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/samples`;

        const response = await this.postRequest<CreatedResponse, CreateSample>({
            bearerToken: options.bearerToken,
            data: options.data,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<CreatedResponse>(response, CreatedResponse);
    }

    async upload(options: UploadRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.organizationId}/samples/upload/${options.projectId}`;

        const response = await this.fileRequest<NoDataResponse, UploadData>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors,
            data: options.data
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }
}
