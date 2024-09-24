import { Entity } from './types/entities/Entity';
import { LicensePolicy } from './types/entities/LicensePolicy';
import { PaginatedResponse } from './types/responses/PaginatedResponse';
import {
    BaseRepository,
    type AuthRepoMethodGetRequestOptions,
    type AuthRepoMethodPostRequestOptions,
    type AuthRepoMethodPatchRequestOptions
} from './BaseRepository';
import type { CreatePolicy, PolicyUpdate } from './types/postBodies/CreatePolicy';
import { CreatedResponse } from './types/responses/CreatedResponse';
import { NoDataResponse } from './types/responses/NoDataResponse';

export interface GetLicensePoliciesRequestOptions extends AuthRepoMethodGetRequestOptions {
    orgId: string;
    // integrationId: string;
    page: number;
    entries_per_page: number;
    search_key: string;
}

export interface CreatePolicyOptions extends AuthRepoMethodPostRequestOptions<CreatePolicy> {
    orgId: string;
}
export interface UpdatePolicyRequestOptions
    extends AuthRepoMethodPatchRequestOptions<PolicyUpdate> {
    orgId: string;
    policyId: string;
}

export class LicensePolicyRepository extends BaseRepository {
    async getLicensePolicies(
        options: GetLicensePoliciesRequestOptions
    ): Promise<PaginatedResponse<LicensePolicy>> {
        const RELATIVE_URL = `/org/${options.orgId}/policies/license_policy`;

        const response = await this.getRequest<PaginatedResponse<LicensePolicy>>({
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

        return Entity.unMarshal<PaginatedResponse<LicensePolicy>>(
            response,
            PaginatedResponse<LicensePolicy>
        );
    }

    async createPolicy(options: CreatePolicyOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/policies/license_policy`;

        const response = await this.postRequest<CreatedResponse, CreatePolicy>({
            bearerToken: options.bearerToken,
            data: options.data,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<CreatedResponse>(response, CreatedResponse);
    }

    async updatePolicy(options: UpdatePolicyRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/policies/license_policy/${options.policyId}`;

        const response = await this.patchRequest<NoDataResponse, PolicyUpdate>({
            data: options.data,
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }
}
