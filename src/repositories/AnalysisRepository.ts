import { Entity } from './types/entities/Entity';
import {
    BaseRepository,
    type AuthRepoMethodGetRequestOptions,
    type AuthRepoMethodPostRequestOptions,
    type EmptyPostData,
    type AuthRepoMethodEmptyDeleteRequestOptions
} from './BaseRepository';
import type { CreateAnalysis } from './types/postBodies/CreateAnalysis';
import { CreatedResponse } from './types/responses/CreatedResponse';
import { PaginatedResponse } from './types/responses/PaginatedResponse';
import type { Analysis } from './types/entities/Analysis';
import { DataResponse } from './types/responses/DataResponse';
import { NoDataResponse } from './types/responses/NoDataResponse';

export interface GetAnalysesRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    projectId: string;
    page: number;
    entries_per_page: number;
    search_key: string;
}

export interface GetAnalysisByIdRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    projectId: string;
    analysisId: string;
}

export interface DeleteAnalysisOptions extends AuthRepoMethodEmptyDeleteRequestOptions {
    orgId: string;
    projectId: string;
    analysisId: string;
}

export interface CreateAnalysisOptions extends AuthRepoMethodPostRequestOptions<CreateAnalysis> {
    orgId: string;
    projectId: string;
}

export class AnalysisRepository extends BaseRepository {
    async createAnalysis(options: CreateAnalysisOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analyses`;

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

    async getAnalyses(options: GetAnalysesRequestOptions): Promise<PaginatedResponse<Analysis>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analyses`;

        const response = await this.getRequest<PaginatedResponse<Analysis>>({
            queryParams: {
                page: options.page,
                entries_per_page: options.entries_per_page,
                search_key: options.search_key
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<PaginatedResponse<Analysis>>(response, PaginatedResponse<Analysis>);
    }

    async getProjectById(options: GetAnalysisByIdRequestOptions): Promise<DataResponse<Analysis>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analyses/${options.analysisId}`;

        const response = await this.getRequest<DataResponse<Analysis>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<Analysis>>(response, DataResponse<Analysis>);
    }

    async getAnalysisChartById(
        options: GetAnalysisByIdRequestOptions
    ): Promise<DataResponse<Array<object>>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analyses/${options.analysisId}/chart`;

        const response = await this.getRequest<DataResponse<Array<object>>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<Array<object>>>(response, DataResponse<Array<object>>);
    }

    async deleteAnalysis(options: DeleteAnalysisOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analyses/${options.analysisId}`;

        const response = await this.deleteRequest<NoDataResponse, EmptyPostData>({
            data: {},
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }
}
