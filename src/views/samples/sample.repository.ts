import { Entity } from '../../types/BaseEntity';
import { CreatedResponse } from '@/types/responses/CreatedResponse';
import {
    BaseRepository,
    type AuthRepoMethodEmptyDeleteRequestOptions,
    type AuthRepoMethodGetRequestOptions,
    type AuthRepoMethodPostRequestOptions,
    type EmptyPostData,
    type PaginatedRepoMethodRequestOptions,
    type SearchableRepoMethodRequestOptions,
    type SortableRepoMethodRequestOptions
} from '../../types/BaseRepository';
import type { CreateSample } from './create/create_sample.http';
import { PaginatedResponse } from '../../types/responses/PaginatedResponse';
import type { Sample } from './sample.entity';
import type { UploadData, UploadRequestOptions } from '../projects/file.repository';
import { NoDataResponse } from '../../types/responses/NoDataResponse';
import type { CreateAnalysis } from '../projects/create_analysis.http';
import { DataResponse } from '../../types/responses/DataResponse';

export interface GetSamplesRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        PaginatedRepoMethodRequestOptions,
        SearchableRepoMethodRequestOptions,
        SortableRepoMethodRequestOptions {
    orgId: string;
}

export interface GetQCRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    sampleId: string;
}

export interface GetSamplesByProjectRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        PaginatedRepoMethodRequestOptions,
        SearchableRepoMethodRequestOptions,
        SortableRepoMethodRequestOptions {
    orgId: string;
    projectId: string;
}

export interface DeleteSampleOptions extends AuthRepoMethodEmptyDeleteRequestOptions {
    orgId: string;
    sampleId: string;
}

export interface DeleteProjectOptions extends AuthRepoMethodEmptyDeleteRequestOptions {
    orgId: string;
    projectId: string;
}

export interface CreateSampleOptions extends AuthRepoMethodPostRequestOptions<CreateSample> {
    orgId: string;
}

export interface ImportPublicSampleOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    sampleId: string;
}

export interface CreateAnalysisOptions extends AuthRepoMethodPostRequestOptions<CreateAnalysis> {
    orgId: string;
    sampleId: string;
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

    async getPublicSamples(options: GetSamplesRequestOptions): Promise<PaginatedResponse<Sample>> {
        const RELATIVE_URL = `/org/${options.orgId}/samples/public`;

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

    async getSamplesByProjectId(
        options: GetSamplesByProjectRequestOptions
    ): Promise<PaginatedResponse<Sample>> {
        const RELATIVE_URL = `/org/${options.orgId}/samples/byproject/${options.projectId}`;

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

    async getQC(options: GetQCRequestOptions): Promise<DataResponse<string>> {
        const RELATIVE_URL = `/org/${options.orgId}/samples/${options.sampleId}/qc`;

        const response = await this.getRequest<DataResponse<string>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<string>>(response, DataResponse<string>);
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

    async importPublicSample(options: ImportPublicSampleOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/samples/import/${options.sampleId}`;

        const response = await this.getRequest<CreatedResponse>({
            bearerToken: options.bearerToken,
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

    async createAnalysis(options: CreateAnalysisOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/samples/${options.sampleId}/analyses`;

        const response = await this.postRequest<CreatedResponse, CreateAnalysis>({
            bearerToken: options.bearerToken,
            data: options.data,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<CreatedResponse>(response, CreatedResponse);
    }

    async deleteSample(options: DeleteSampleOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/samples/${options.sampleId}`;

        const response = await this.deleteRequest<NoDataResponse, EmptyPostData>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors,
            data: {}
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }

    async deleteProject(options: DeleteProjectOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/samples/project/${options.projectId}`;

        const response = await this.deleteRequest<NoDataResponse, EmptyPostData>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors,
            data: {}
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }
}
