import { Entity } from './types/entities/Entity';
import {
    BaseRepository,
    type AuthRepoMethodGetRequestOptions,
    type PaginatedRepoMethodRequestOptions,
    type SortableRepoMethodRequestOptions
} from './BaseRepository';
import { DataResponse } from './types/responses/DataResponse';
import type { AnalysisStats, PatchingStats, SbomStats } from './types/entities/Stats';
import { Dependency, type SbomGraph } from './types/entities/Graph';
import { PaginatedResponse } from './types/responses/PaginatedResponse';
import type { License } from './types/entities/License';
import type { VulnerabilityMerged } from '@/repositories/types/entities/VulnStats';
import type { PatchInfo, PatchOccurenceInfo, PatchedManifestData } from './types/entities/Patching';
import type { VulnerabilityDetails } from './types/entities/VulnDetails';
import { DependencyDetails } from './types/entities/SbomDetails';

export interface GetSbomStatsRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    projectId: string;
    analysisId: string;
    workspace: string;
}

export interface GetFindingRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    projectId: string;
    analysisId: string;
    findingId: string;
    workspace: string;
}

export interface GetSbomRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        PaginatedRepoMethodRequestOptions,
        SortableRepoMethodRequestOptions {
    orgId: string;
    projectId: string;
    analysisId: string;
    workspace: string;
    active_filters: string;
    search_key: string;
}

export interface GetDependencyRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    projectId: string;
    analysisId: string;
    dependency: string;
    workspace: string;
}

export class ResultsRepository extends BaseRepository {
    async getSbomStat(options: GetSbomStatsRequestOptions): Promise<DataResponse<SbomStats>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/sbom/stats`;

        const response = await this.getRequest<DataResponse<SbomStats>>({
            queryParams: {
                workspace: options.workspace
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<SbomStats>>(response, DataResponse<SbomStats>);
    }

    async getSbomGraph(options: GetSbomStatsRequestOptions): Promise<DataResponse<SbomGraph>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/sbom/graph`;

        const response = await this.getRequest<DataResponse<SbomGraph>>({
            queryParams: {
                workspace: options.workspace
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<SbomGraph>>(response, DataResponse<SbomGraph>);
    }

    async getSbom(options: GetSbomRequestOptions): Promise<PaginatedResponse<Dependency>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/sbom`;

        const response = await this.getRequest<PaginatedResponse<Dependency>>({
            queryParams: {
                workspace: options.workspace,
                page: options.pagination.page,
                entries_per_page: options.pagination.entries_per_page,
                sort_by: options.sort.sortKey,
                sort_direction: options.sort.sortDirection,
                active_filters: options.active_filters,
                search_key: options.search_key
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<PaginatedResponse<Dependency>>(
            response,
            PaginatedResponse<Dependency>
        );
    }

    async getDependency(
        options: GetDependencyRequestOptions
    ): Promise<DataResponse<DependencyDetails>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/sbom/dependency`;

        const response = await this.getRequest<DataResponse<DependencyDetails>>({
            queryParams: {
                workspace: options.workspace,
                dependency: options.dependency
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<DependencyDetails>>(
            response,
            DataResponse<DependencyDetails>
        );
    }

    async getDependencyGraph(
        options: GetDependencyRequestOptions
    ): Promise<DataResponse<SbomGraph>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/sbom/dependency/graph`;

        const response = await this.getRequest<DataResponse<SbomGraph>>({
            queryParams: {
                workspace: options.workspace,
                dependency: options.dependency
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<SbomGraph>>(response, DataResponse<SbomGraph>);
    }

    async getLicenses(options: GetSbomRequestOptions): Promise<PaginatedResponse<License>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/licenses`;

        const response = await this.getRequest<PaginatedResponse<License>>({
            queryParams: {
                workspace: options.workspace,
                page: options.pagination.page,
                entries_per_page: options.pagination.entries_per_page,
                sort_by: options.sort.sortKey,
                sort_direction: options.sort.sortDirection,
                active_filters: options.active_filters,
                search_key: options.search_key
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<PaginatedResponse<License>>(response, PaginatedResponse<License>);
    }

    async getVulnerabilitiesStat(
        options: GetSbomStatsRequestOptions
    ): Promise<DataResponse<AnalysisStats>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/findings/stats`;

        const response = await this.getRequest<DataResponse<AnalysisStats>>({
            queryParams: {
                workspace: options.workspace
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<AnalysisStats>>(response, DataResponse<AnalysisStats>);
    }

    async getVulnerabilities(
        options: GetSbomRequestOptions
    ): Promise<PaginatedResponse<VulnerabilityMerged>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/findings`;

        const response = await this.getRequest<PaginatedResponse<VulnerabilityMerged>>({
            queryParams: {
                workspace: options.workspace,
                page: options.pagination.page,
                entries_per_page: options.pagination.entries_per_page,
                sort_by: options.sort.sortKey,
                sort_direction: options.sort.sortDirection,
                active_filters: options.active_filters,
                search_key: options.search_key
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<PaginatedResponse<VulnerabilityMerged>>(
            response,
            PaginatedResponse<VulnerabilityMerged>
        );
    }

    async getFinding(
        options: GetFindingRequestOptions
    ): Promise<DataResponse<VulnerabilityDetails>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/findings/finding/${options.findingId}`;

        const response = await this.getRequest<DataResponse<VulnerabilityDetails>>({
            queryParams: {
                workspace: options.workspace
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<VulnerabilityDetails>>(
            response,
            DataResponse<VulnerabilityDetails>
        );
    }

    async getPatchesStat(
        options: GetSbomStatsRequestOptions
    ): Promise<DataResponse<PatchingStats>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/patching/stats`;

        const response = await this.getRequest<DataResponse<PatchingStats>>({
            queryParams: {
                workspace: options.workspace
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<PatchingStats>>(response, DataResponse<PatchingStats>);
    }

    async getPatches(options: GetSbomRequestOptions): Promise<PaginatedResponse<PatchInfo>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/patching`;

        const response = await this.getRequest<PaginatedResponse<PatchInfo>>({
            queryParams: {
                workspace: options.workspace,
                page: options.pagination.page,
                entries_per_page: options.pagination.entries_per_page,
                sort_by: options.sort.sortKey,
                sort_direction: options.sort.sortDirection,
                active_filters: options.active_filters,
                search_key: options.search_key
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<PaginatedResponse<PatchInfo>>(
            response,
            PaginatedResponse<PatchInfo>
        );
    }

    async getPatchesManifest(
        options: GetSbomStatsRequestOptions
    ): Promise<DataResponse<PatchedManifestData>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/patching/manifest`;

        const response = await this.getRequest<DataResponse<PatchedManifestData>>({
            queryParams: {
                workspace: options.workspace
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<PatchedManifestData>>(
            response,
            DataResponse<PatchedManifestData>
        );
    }

    async getPatchingGraph(
        options: GetSbomStatsRequestOptions
    ): Promise<DataResponse<Map<string, PatchOccurenceInfo>>> {
        const RELATIVE_URL = `/org/${options.orgId}/projects/${options.projectId}/analysis/${options.analysisId}/patching/tree`;

        const response = await this.getRequest<DataResponse<Map<string, PatchOccurenceInfo>>>({
            queryParams: {
                workspace: options.workspace
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<DataResponse<Map<string, PatchOccurenceInfo>>>(
            response,
            DataResponse<Map<string, PatchOccurenceInfo>>
        );
    }
}
