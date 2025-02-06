import { Entity } from './types/entities/Entity';
import { Project } from './types/entities/Project';
import { CreatedResponse } from '@/repositories/types/responses/CreatedResponse';
import { PaginatedResponse } from './types/responses/PaginatedResponse';
import { NoDataResponse } from './types/responses/NoDataResponse';
import { DataResponse } from './types/responses/DataResponse';
import {
    BaseRepository,
    type AuthRepoMethodPostRequestOptions,
    type AuthRepoMethodGetRequestOptions,
    type EmptyPostData,
    type AuthRepoMethodEmptyDeleteRequestOptions,
    type PaginatedRepoMethodRequestOptions,
    type SearchableRepoMethodRequestOptions,
    type SortableRepoMethodRequestOptions
} from './BaseRepository';
import type { CreateProject } from '@/repositories/types/postBodies/CreateProject';
import type { CreateAnalysis } from './types/postBodies/CreateAnalysis';
import type { Result } from './types/entities/Result';
import type { Chat } from './types/entities/Chat';

export interface GetProjectsRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        PaginatedRepoMethodRequestOptions,
        SearchableRepoMethodRequestOptions,
        SortableRepoMethodRequestOptions {
    orgId: string;
}

export interface GetProjectByIdRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    projectId: string;
}

export interface GetGraphByAnalysisIdRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    projectId: string;
    analysisId: string;
}

export interface CreateAnalysisOptions extends AuthRepoMethodPostRequestOptions<CreateAnalysis> {
    orgId: string;
    projectId: string;
}
// export interface DeleteProjectAnalysisOptions extends DeleteRequestOptions<NoDataResponse> {
//     analysisId: string;
// }

// export interface DeleteProjectOptions extends DeleteRequestOptions<NoDataResponse> {
//     projectId: string;
// }

export interface DeleteProjectOptions extends AuthRepoMethodEmptyDeleteRequestOptions {
    orgId: string;
    projectId: string;
}

export interface CreateProjectOptions extends AuthRepoMethodPostRequestOptions<CreateProject> {
    orgId: string;
}

export enum ProjectsSortInterface {
    IMPORTED_ON = 'imported_on',
    URL = 'url',
    NAME = 'name',
    VERSION = 'version',
    LICENSES = 'licenses',
    COMBINED_SEVERITY = 'combined_severity',
    DEPRECATED = 'deprecated',
    OUTDATED = 'outdated',
    UNLICENSED = 'unlicensed',
    TYPE = 'user_installed',
    NEWEST_RELEASE = 'newest_release',
    PUBLISHED = 'release',
    CVE = 'cve',
    SEVERITY = 'severity',
    DEPENDENCY_NAME = 'dep_name',
    DEPENDENCY_VERSION = 'dep_version',
    WEAKNESS = 'weakness',
    OWASP_TOP_10 = 'owasp_top_10',
    EXPLOITABILITY = 'exploitability',
    PATCH_TYPE = 'patch_type',
    LICENSE_TYPE = 'type',
    DEPENDENCY_COUNT = 'dep_count',
    ID = 'id'
}

export class ProjectRepository extends BaseRepository {
    async getProjects(options: GetProjectsRequestOptions): Promise<PaginatedResponse<Project>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects`;

        const response = await this.getRequest<PaginatedResponse<Project>>({
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

        return Entity.unMarshal<PaginatedResponse<Project>>(response, PaginatedResponse<Project>);
    }

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

    async getProjectById(options: GetProjectByIdRequestOptions): Promise<DataResponse<Project>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}`;

        const response = await this.getRequest<DataResponse<Project>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<Project>>(response, DataResponse<Project>);
    }

    async getSVGGraph(options: GetProjectByIdRequestOptions): Promise<DataResponse<string>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/svg_graph`;

        const response = await this.getRequest<DataResponse<string>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<string>>(response, DataResponse<string>);
    }

    async getAnalysisGraph(
        options: GetGraphByAnalysisIdRequestOptions
    ): Promise<DataResponse<string>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/png_graph/${options.analysisId}`;

        const response = await this.getRequest<DataResponse<string>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<string>>(response, DataResponse<string>);
    }

    async getResultByAnalysisId(
        options: GetGraphByAnalysisIdRequestOptions
    ): Promise<DataResponse<Result>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/result/${options.analysisId}`;

        const response = await this.getRequest<DataResponse<Result>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<Result>>(response, DataResponse<Result>);
    }

    async getChatHistory(options: GetProjectByIdRequestOptions): Promise<DataResponse<Chat>> {
        const RELATIVE_URL = `/gpt/${options.projectId}/history/${options.orgId}`;

        const response = await this.getRequest<DataResponse<Chat>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<Chat>>(response, DataResponse<Chat>);
    }

    async deleteProject(options: DeleteProjectOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}`;

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

    async createProject(options: CreateProjectOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/projects`;

        const response = await this.postRequest<CreatedResponse, CreateProject>({
            bearerToken: options.bearerToken,
            data: options.data,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<CreatedResponse>(response, CreatedResponse);
    }
}
