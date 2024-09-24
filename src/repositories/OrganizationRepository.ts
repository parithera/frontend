import { Entity } from './types/entities/Entity';
import { DataResponse } from './types/responses/DataResponse';
import {
    BaseRepository,
    type AuthRepoMethodGetRequestOptions,
    type AuthRepoMethodPostRequestOptions,
    type PaginatedRepoMethodRequestOptions,
    type AuthRepoMethodEmptyPostRequestOptions,
    type EmptyPostData,
    type SearchableRepoMethodRequestOptions,
    type SortableRepoMethodRequestOptions,
    type AuthRepoMethodEmptyDeleteRequestOptions
} from './BaseRepository';
import {
    Organization,
    OrganizationInfoForInvitee,
    OrganizationMetaData,
    TeamMember
} from './types/entities/Organization';
import { PaginatedResponse } from './types/responses/PaginatedResponse';
import type { CreateOrg } from './types/postBodies/CreateOrg';
import { CreatedResponse } from './types/responses/CreatedResponse';
import { NoDataResponse } from './types/responses/NoDataResponse';
import type { CreateInvite } from './types/postBodies/CreateInvite';
import { Invitation } from './types/entities/Invitation';
import type { JoinOrg } from './types/postBodies/JoinOrg';
import { AuditLog } from './types/entities/AuditLog';
import { OrganizationMembership } from './types/entities/OrganizationMembership';

interface BaseOrgRequestOptions {
    orgId: string;
}
export interface GetOrgRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        BaseOrgRequestOptions {}
export interface GetUsersOrgsRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        PaginatedRepoMethodRequestOptions {}
export interface CreateOrgRequestOptions extends AuthRepoMethodPostRequestOptions<CreateOrg> {}
export interface CreateOrgInviteRequestOptions
    extends AuthRepoMethodPostRequestOptions<CreateInvite>,
        BaseOrgRequestOptions {}
export interface DeleteOrgRequestOptions
    extends AuthRepoMethodEmptyDeleteRequestOptions,
        BaseOrgRequestOptions {}
export interface LeaveOrgRequestOptions
    extends AuthRepoMethodEmptyPostRequestOptions,
        BaseOrgRequestOptions {}
export interface GetOrgMembersRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        PaginatedRepoMethodRequestOptions,
        SearchableRepoMethodRequestOptions,
        SortableRepoMethodRequestOptions,
        BaseOrgRequestOptions {}
export interface GetOrgMemberRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        BaseOrgRequestOptions {
    userId: string;
}
export interface RevokeOrgMembershipRequestOptions
    extends AuthRepoMethodEmptyDeleteRequestOptions,
        BaseOrgRequestOptions {
    userId: string;
}
export interface GetOrgInvitationsRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        PaginatedRepoMethodRequestOptions,
        SearchableRepoMethodRequestOptions,
        SortableRepoMethodRequestOptions,
        BaseOrgRequestOptions {}
export interface RevokeOrgInvitationRequestOptions
    extends AuthRepoMethodEmptyDeleteRequestOptions,
        BaseOrgRequestOptions {
    invitationId: string;
}
export interface ResendOrgInvitationRequestOptions
    extends AuthRepoMethodEmptyPostRequestOptions,
        BaseOrgRequestOptions {
    invitationId: string;
}
export interface GetOrgInfoForInviteeRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        BaseOrgRequestOptions {
    inviteToken: string;
    userEmailHash: string;
}
export interface JoinOrgRequestOptions
    extends AuthRepoMethodPostRequestOptions<JoinOrg>,
        BaseOrgRequestOptions {}
export interface GetOrgMetaDataRequestOptions
    extends AuthRepoMethodGetRequestOptions,
        BaseOrgRequestOptions {}

export class OrgRepository extends BaseRepository {
    async get(options: GetOrgRequestOptions): Promise<Organization> {
        const RELATIVE_URL = `/org/${options.orgId}`;

        const response = await this.getRequest<DataResponse<Organization>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });
        return Entity.unMarshal<Organization>(response.data, Organization);
    }

    async getMany(
        options: GetUsersOrgsRequestOptions
    ): Promise<PaginatedResponse<OrganizationMembership>> {
        const RELATIVE_URL = `/org`;

        const response = await this.getRequest<PaginatedResponse<OrganizationMembership>>({
            queryParams: {
                page: options.pagination.page,
                entries_per_page: options.pagination.entries_per_page
            },
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        const paginatedResp = Entity.unMarshal<PaginatedResponse<OrganizationMembership>>(
            response,
            PaginatedResponse<OrganizationMembership>
        );
        paginatedResp.data = Entity.unMarshalMany<OrganizationMembership>(
            paginatedResp.data,
            OrganizationMembership
        );
        return paginatedResp;
    }

    async create(options: CreateOrgRequestOptions): Promise<CreatedResponse> {
        const RELATIVE_URL = `/org`;

        const response = await this.postRequest<CreatedResponse, CreateOrg>({
            bearerToken: options.bearerToken,
            data: options.data,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<CreatedResponse>(response, CreatedResponse);
    }

    async delete(options: DeleteOrgRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}`;

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

    async leave(options: LeaveOrgRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/leave_org`;

        const response = await this.postRequest<NoDataResponse, EmptyPostData>({
            bearerToken: options.bearerToken,
            data: {},
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }

    async getOrgMembers(
        options: GetOrgMembersRequestOptions
    ): Promise<PaginatedResponse<TeamMember>> {
        const RELATIVE_URL = `/org/${options.orgId}/members`;

        const response = await this.getRequest<PaginatedResponse<TeamMember>>({
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

        const paginatedResp = Entity.unMarshal<PaginatedResponse<TeamMember>>(
            response,
            PaginatedResponse<TeamMember>
        );
        paginatedResp.data = Entity.unMarshalMany<TeamMember>(paginatedResp.data, TeamMember);
        return paginatedResp;
    }

    async getOrgMember(options: GetOrgMemberRequestOptions): Promise<TeamMember> {
        const RELATIVE_URL = `/org/${options.orgId}/members/${options.userId}`;

        const response = await this.getRequest<DataResponse<TeamMember>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<TeamMember>(response.data, TeamMember);
    }

    async revokeMembership(options: RevokeOrgMembershipRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/members/${options.userId}`;

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

    async inviteUser(options: CreateOrgInviteRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/create_invite`;

        const response = await this.postRequest<NoDataResponse, CreateInvite>({
            bearerToken: options.bearerToken,
            data: options.data,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }

    async getInvitations(
        options: GetOrgInvitationsRequestOptions
    ): Promise<PaginatedResponse<Invitation>> {
        const RELATIVE_URL = `/org/${options.orgId}/invitations`;

        const response = await this.getRequest<PaginatedResponse<Invitation>>({
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

        const paginatedResp = Entity.unMarshal<PaginatedResponse<Invitation>>(
            response,
            PaginatedResponse<Invitation>
        );
        paginatedResp.data = Entity.unMarshalMany<Invitation>(paginatedResp.data, Invitation);
        return paginatedResp;
    }

    async revokeInvitation(options: RevokeOrgInvitationRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/invitations/${options.invitationId}`;

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

    async resendOrgInvitationEmail(
        options: ResendOrgInvitationRequestOptions
    ): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/invitations/${options.invitationId}/resend`;

        const response = await this.postRequest<NoDataResponse, EmptyPostData>({
            data: {},
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }

    async getOrgInfoAsInvitedMember(
        options: GetOrgInfoForInviteeRequestOptions
    ): Promise<OrganizationInfoForInvitee> {
        const RELATIVE_URL = `/org/${options.orgId}/org_info_invitee`;

        const response = await this.getRequest<DataResponse<OrganizationInfoForInvitee>>({
            bearerToken: options.bearerToken,
            queryParams: {
                token: options.inviteToken,
                user_email_hash: options.userEmailHash
            },
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<OrganizationInfoForInvitee>(
            response.data,
            OrganizationInfoForInvitee
        );
    }

    async joinOrgViaInvitation(options: JoinOrgRequestOptions): Promise<NoDataResponse> {
        const RELATIVE_URL = `/org/${options.orgId}/join`;

        const response = await this.postRequest<NoDataResponse, JoinOrg>({
            data: options.data,
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });

        return Entity.unMarshal<NoDataResponse>(response, NoDataResponse);
    }

    async getOrgAuditLogs(
        options: GetOrgMembersRequestOptions
    ): Promise<PaginatedResponse<AuditLog>> {
        const RELATIVE_URL = `/org/${options.orgId}/audit_logs`;

        const response = await this.getRequest<PaginatedResponse<AuditLog>>({
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

        const paginatedResp = Entity.unMarshal<PaginatedResponse<AuditLog>>(
            response,
            PaginatedResponse<AuditLog>
        );
        paginatedResp.data = Entity.unMarshalMany<AuditLog>(paginatedResp.data, AuditLog);
        return paginatedResp;
    }

    async getOrgMetaData(options: GetOrgMetaDataRequestOptions): Promise<OrganizationMetaData> {
        const RELATIVE_URL = `/org/${options.orgId}/meta_data`;

        const response = await this.getRequest<DataResponse<OrganizationMetaData>>({
            bearerToken: options.bearerToken,
            url: this.buildUrl(RELATIVE_URL),
            handleBusinessErrors: options.handleBusinessErrors,
            handleHTTPErrors: options.handleHTTPErrors,
            handleOtherErrors: options.handleOtherErrors
        });
        return Entity.unMarshal<OrganizationMetaData>(response.data, OrganizationMetaData);
    }
}
